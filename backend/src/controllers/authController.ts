import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Request, Response} from "express"
import { createUser, findUser } from "../models/user.model";


interface registerBody {    
    email: string,
    username: string,
    password: string
}
export const register = async (req:Request<{},{}, registerBody>, res:Response) => {
     const { email, username, password} = req.body

     const userExist = await findUser(email, username);
     if (userExist) return res.status(400).json({msg:"User already exists"})
    const hashedPassword = await bcrypt.hash(password,10)

     const newUser = await createUser(email, username, hashedPassword);
     res.json(newUser)
    
}

export const login = async (req:Request<{},{}, {username:string, password:string}>, res:Response) => {
    const {username, password} = req.body
    const user = await findUser("", username)
    if (!user) return res.status(400).json({msg: "User not found"})

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(400).json({msg:"Authentication Mismatched1!"})

    const token = jwt.sign({id: user.id, username:user.username}, process.env.JWT_SECRET!,{expiresIn: "1d"})
    res.json({ token, user });
}