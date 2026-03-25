
import { GameService } from "@/services/game.service"; 
import { ChessBoardInitialize } from "@/services/chess/core/game.initialization"; 
import { ChessMovement } from "@/services/chess/core/game.makeMove"; 
import { ChessModel } from "@/models/chess.model";
import { ChessSocket } from "@/sockets/chess.socket";




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
        super(chessSocket);
        
    }

    async startGame(gameData: any, userId: number) {
        const {blackPlayerId, timeControl } = gameData
        
        const game = this.initializer.execute(userId, blackPlayerId, timeControl);
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
    async playMove(gameId: string, playerId: number, from: string, to: string, promotion?:string) {

        const game = await this.chessModel.getGameData(gameId);

        const now = Date.now();
        const timeSpent = now - game.last_move_at;

        // Deduct time
        if (game.current_turn === "w") {
            game.white_time_left -= timeSpent;
        } else {
            game.black_time_left -= timeSpent;
        }

        // Timeout check
        if (game.white_time_left <= 0) {
            const updated = await this.chessModel.updateGameState(gameId, {
                status: "timeout",
                winner: "black"
            });
            this.chessSocket.emitGameEnd(updated);
            return updated;
        }

        if (game.black_time_left <= 0) {
            const updated = await this.chessModel.updateGameState(gameId, {
                status: "timeout",
                winner: "white"
            });
            this.chessSocket.emitGameEnd(updated);
            return updated;
        }

        // Execute move
        const result = await this.movement.execute(gameId, playerId, from, to);

        // Add increment
        const { incrementMs } = this.parseTimeControl(game.time_control);

        if (game.current_turn === "w") {
            game.white_time_left += incrementMs;
        } else {
            game.black_time_left += incrementMs;
        }

        // Update DB
        const updatedGame = await this.chessModel.updateGameState(gameId, {
            white_time_left: game.white_time_left,
            black_time_left: game.black_time_left,
            last_move_at: Date.now()
        });

        // Emit
        this.chessSocket.chessPlayerMoved({
            ...updatedGame,
            move: result.move
        });

        return updatedGame;
    }

    
    async getHistory(gameId: string) {
        const result = await this.chessModel.getMoveHistory(gameId);
        return Array.isArray(result) ? result : (result as any).rows;
    }

    async resignGame(gameId: string, playerId: number) {
        const game = await this.chessModel.getGameData(gameId);
        const winner = playerId === game.white_player_id ? 'black' : 'white';
        
        const updatedGame = await this.chessModel.updateGameState(gameId, {
            status: 'resigned',
            winner: winner
        } as any);

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

        if(game.draw_offer_by === playerId){
            throw new Error("you already offered draw")
        }

        if(game.draw_status === "pending"){
            throw new Error("Draw already offered")
        }

        if (game.last_draw_offer_at && Date.now() - game.last_draw_offer_at < 10000) {
            throw new Error("Wait before offering again");
}
        await this.chessModel.updateGameState(gameId, {
        draw_status: "pending",
        draw_offer_by: playerId
    });
    this.chessSocket.chessDraw(game)
    return { message: "Draw offered" };
    }

    async acceptDraw(gameId:string, playerId:number){
        const game = await this.chessModel.getGameData(gameId)

        if(game.draw_status !== "pending"){
            throw new Error("No Draw Offered")
        }

        if(game.draw_offer_by === playerId){
            throw new Error("You cant accept your own offer")
        }

        await this.chessModel.updateGameState(gameId,{draw_status:"accepted",status:"draw"})
        this.chessSocket.chessDraw(game)
        return {message:"Game Draw"}
    }
    
        async rejectDraw(gameId: string, userId: number) {
            const game = await this.chessModel.getGameData(gameId);

            if (game.draw_status !== "pending") {
                throw new Error("No draw offer");
            }

            if (game.draw_offer_by === userId) {
                throw new Error("You cannot reject your own offer");
            }

            await this.chessModel.updateGameState(gameId, {
                draw_status: "rejected",
                draw_offer_by: null
            });
            this.chessSocket.chessDraw(game)
            return { message: "Draw rejected" };
        }
}