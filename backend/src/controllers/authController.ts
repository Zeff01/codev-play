import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Request, Response, NextFunction } from "express";
import { createUser, findUserByEmail, findUserByLogin, findUserByUsername } from "../models/user.model";
import { ApiResponse } from "../utils/apiResponse";
import AppError from "../middleware/AppError";

interface registerBody {
  email: string;
  username: string;
  password: string;
}

export const register = async (req: Request<{}, {}, registerBody>, res: Response, next: NextFunction) => {
  try {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
      return ApiResponse.error(res, "All fields are required", 400);
    }

    if (await findUserByEmail(email)) {
      return ApiResponse.error(res, "Email already registered", 400);
    }

    if (await findUserByUsername(username)) {
      return ApiResponse.error(res, "Username already taken", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await createUser(email, username, hashedPassword);

    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json(userWithoutPassword);

    return ApiResponse.success(res, { user: userWithoutPassword }, "User registered successfully", 201);
  } catch (error) {
    next(new AppError("Registration failed", 500));
  }
};

export const login = async (
  req: Request<{}, {}, { username: string; password: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { username, password } = req.body;

    const user = await findUserByLogin(username);
    if (!user) {
      return ApiResponse.error(res, "Invalid credentials", 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return ApiResponse.error(res, "Invalid credentials", 401);
    }
    ``;

    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET!, { expiresIn: "7d" });

    try {
      res.cookie("token", token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000, sameSite: "none", secure: true });
    } catch (error) {
      console.error("JWT verification failed:", error);
    }

    const { password: _, ...userWithoutPassword } = user;

    return ApiResponse.success(res, { user: userWithoutPassword }, "Login successful");
  } catch (error) {
    next(new AppError("Login failed", 500));
  }
};
