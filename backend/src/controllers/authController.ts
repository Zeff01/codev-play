import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Request, Response} from "express"
import { createUser, findUserByUsername,findUserByEmail, findUserByLogin } from "../models/user.model";


interface registerBody {    
    email: string,
    username: string,
    password: string
}

export const register = async (req: Request<{}, {}, registerBody>, res: Response) => {
  try {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    if (await findUserByEmail(email)) {
      return res.status(400).json({ msg: "Email already registered" });
    }

    if (await findUserByUsername(username)) {
      return res.status(400).json({ msg: "Username already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await createUser(email, username, hashedPassword);

    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

export const login = async (req: Request<{}, {}, { username: string; password: string }>, res: Response) => {
  try {
    const { username, password } = req.body;

    const user = await findUserByLogin(username);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ msg: "Invalid username or password" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    const { password: _, ...userWithoutPassword } = user;
    res.json({ token, user: userWithoutPassword });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ msg: "Server error" });
  }
};


