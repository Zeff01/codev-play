import { Request, Response } from "express";
import { ChessService } from "@/services/chess/chess.services";
import { GameController } from "./game.controller";


export class ChessController extends GameController<ChessService> {
    constructor(service:ChessService){
        super(service)
    }

    async makeMoveController(req:Request<{gameId:string},{},{from:string, to:string, promotion?:string}>, res:Response):Promise<void>{
       try {
        const { gameId } = req.params
        const playerId = Number(req.user!.id)
        const {from, to, promotion} = req.body


       const result = await this.service.playMove(gameId, playerId ,from, to, promotion)
       res.json(result)
    
       } catch (err) {

        const error = err as Error
        res.status(400).json({error: error.message})
       }
    }


    async getHistoryController(req:Request<{gameId:string},{},{}>,res:Response):Promise<void>{
        try {
            const {gameId} = req.params
            if(!gameId){
                res.status(400).json({error:"Game ID is required"})
                return
            }
            const history = await this.service.getHistory(gameId)
            res.json(history)
        } catch (err) {
            const error = err as Error
            res.status(400).json({error: error.message})
        }
    }

    async resignGameController(req:Request<{gameId:string},{},{}>, res:Response):Promise<void>{
        try {
            const {gameId} =req.params
            const playerId = Number(req.user!.id)
            const resign = await this.service.resignGame(gameId,playerId)

            res.json(resign)
        } catch (err) {
            const error = err as Error
            res.status(400).json({error:error.message})
        }

    
    }

    async offerDrawController(req:Request<{gameId:string},{},{}>, res:Response):Promise<void>{
        try {
            const {gameId}= req.params
            const playerId = Number(req.user!.id)
            const offerDraw = await this.service.offerDraw(gameId,playerId)

            res.status(200).json(offerDraw)
        } catch (err) {
            res.status(400).json({error:(err as Error).message})
        }
    }

    async acceptDrawController(req:Request<{gameId:string},{},{}>,res:Response):Promise<void>{
        try {
            const {gameId} = req.params
            const playerId = Number(req.user!.id)
            const acceptDraw = await this.service.acceptDraw(gameId,playerId)

            res.status(200).json(acceptDraw)
        } catch (err) {
            res.status(400).json({error:(err as Error).message})
        }
    }

    async rejectDrawController(req:Request<{gameId:string},{},{}>,res:Response):Promise<void>{
        try {
            const {gameId} =req.params
            const playerId = Number(req.user!.id)
            const rejectDraw = await this.service.rejectDraw(gameId,playerId)

            res.status(200).json(rejectDraw)
        } catch (err) {
            res.status(400).json({error:(err as Error).message})
        }

    }

}