
import { GameService } from "@/services/game.service"; 
import { ChessBoardInitialize } from "@/services/chess/core/game.initialization"; 
import { ChessMovement } from "@/services/chess/core/game.makeMove"; 
import { ChessModel } from "@/models/chess.model";
import { ChessSocket } from "@/sockets/chess.socket";
import { Chess } from "chess.js";
import { roomManager } from "@/config/socket-server";




export class ChessService extends GameService<any> {

    private initializer = new ChessBoardInitialize();
    private movement = new ChessMovement();
    private parseTimeControl(tc:string){
        const [base, increment]= tc.split("+").map(Number)
        return{
            baseMs: base * 60 * 1000,
            incrementMs: increment * 1000
        } 
    }

    constructor(
        private chessSocket: ChessSocket,
        private chessModel = new ChessModel
    ) {
        super(chessModel);
        
    }

    async startGame(gameData: any, userId: number) {
        const {blackPlayerId, timeControl } = gameData
        
        const game = await this.initializer.execute(userId, blackPlayerId, timeControl);
        this.chessSocket.chessPlayerJoined(game);
        return game;
    }

    
    async joinGame(gameId: string, userId: number) {
        const game = await this.chessModel.updateGameState(gameId, { 
            black_player_id: userId 
        } as any);
        this.chessSocket.chessPlayerJoined(game);
        return game;
    }
    async playMove(gameId: string, playerId: number, from: string, to: string, promotion?: string) {
        // Execute move — this validates the move, updates clocks/turn, and persists to DB
        const result = await this.movement.execute(gameId, playerId, from, to, promotion);
        // Fetch the freshly persisted game state
        const updatedGame = await this.chessModel.getGameData(gameId);
        // Emit
        this.chessSocket.chessPlayerMoved({
            ...updatedGame,
        });

        return updatedGame;
    }

    
    async getHistory(gameId: string) {
        const game = await this.chessModel.getGameData(gameId);
        if(!game) throw new Error ("Game not found!");

        const engine = new Chess();

        if(game.pgn_data && game.pgn_data.trim() !== ""){
            engine.loadPgn(game.pgn_data);
        }
        const verboseHistory = engine.history({verbose:true})

        return verboseHistory

    }

    async resignGame(gameId: string, playerId: number) {
        const game = await this.chessModel.getGameData(gameId);
        if(!game) throw new Error ("Game not found!");
        const winner = playerId === game.white_player_id ? 'black' : 'white';
        
        const updatedGame = await this.chessModel.updateGameState(gameId, {
            ...game,
            status: 'resigned',
            winner: winner
        });

         roomManager.setGameId(gameId, "");
         this.chessSocket.emitGameEnd(updatedGame);
         return updatedGame;

    }

    async offerDraw(gameId:string, playerId:number){
        const game = await this.chessModel.getGameData(gameId)
        if(!game){
            throw new  Error("Game not found")
        }

        if(game.status !== "ongoing"){
            throw new Error("Game Has Finished")
        }
        if (playerId !== game.white_player_id && playerId !== game.black_player_id) {
            throw new Error("Player is not part of this game");
        }
        if(game.draw_offer_by === playerId){
            throw new Error("you already offered draw")
        }
        if(game.draw_status === "pending"){
            throw new Error("Draw already offered")
        }

        const updatedGame = await this.chessModel.updateGameState(gameId, {
            ...game,
        draw_status: "pending",
        draw_offer_by: playerId
    });
    this.chessSocket.chessDraw(updatedGame)
    return { message: "Draw offered" };
    }

    async acceptDraw(gameId:string, playerId:number){
        const game = await this.chessModel.getGameData(gameId)
        
        if(!game){
            throw new Error("Game not found!")
        }

        if(game.draw_status !== "pending"){
            throw new Error("No Draw Offered")
        }

        if(game.draw_offer_by === playerId){
            throw new Error("You cant accept your own offer")
        }

        
        await this.chessModel.updateGameState(gameId,{...game,draw_status:"accepted",status:"draw"})
        roomManager.setGameId(gameId, "");
        
        this.chessSocket.chessDraw(game)
        return {message:"Game Draw"}
    }
    
    async rejectDraw(gameId: string, playerId: number) {
        const game = await this.chessModel.getGameData(gameId);

        if(!game){
            throw new Error("Game not found!")
        }
        if (game.draw_status !== "pending") {
                throw new Error("No draw offer");
        }

        if (game.draw_offer_by === playerId) {
            throw new Error("You cannot reject your own offer");
        }

        await this.chessModel.updateGameState(gameId, {
            ...game,
            draw_status: "rejected",
            draw_offer_by: null
        });
        this.chessSocket.chessDraw(game)
        return { message: "Draw rejected" };
        }
}