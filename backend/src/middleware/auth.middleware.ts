import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken"


export const auth = (req:Request,  res:Response, next:NextFunction)=>{
    try{
        const header = req.headers.authorization
        if(!header){
            return res.status(401).json({msg:" No authorization header"})
        }
        const token = header.split(" ")[1];
        if(!token){
            return res.status(401).json({msg:"Token Missing"});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        req.user = decoded;
        next();
    }
}