import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken"

export const auth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const header = req.headers.authorization;

    if (!header) {
      return res.status(401).json({ msg: "No authorization header" });
    }

    if (!header.startsWith("Bearer ")) {
      return res.status(401).json({ msg: "Invalid authorization format" });
    }

    const token = header.split(" ")[1];

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ msg: "JWT secret not configured" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ msg: "Invalid or expired token" });
  }
};


export const registerValidation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
  const { email, username, password } = req.body;
    if (!email || !username || !password) 
        return res.status(400).json({ msg: "Email, username, and password are required" });

    if (password.length < 6) 
        return res.status(400).json({ msg: "Password must be at least 6 characters long" });
    if (!/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(email)) 
        return res.status(400).json({ msg: "Invalid email format" });
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        return res.status(400).json({ msg: "Username can only contain letters, numbers, and underscores" });
    }
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
    }
};

export const loginValidation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) 
        return res.status(400).json({ msg: "Username and password are required" });

    if (password.length < 6) 
        return res.status(400).json({ msg: "Password must be at least 6 characters long" });
    if (!/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(username)) 
        return res.status(400).json({ msg: "Invalid username format" });
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};