import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ApiResponse } from "../utils/apiResponse";
import cookieParser from "cookie-parser";

export const auth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;
    if (!process.env.JWT_SECRET) {
      return ApiResponse.error(res, "JWT secret missing", 500);
    }

    if (!token) {
      return ApiResponse.error(res, "No token provided", 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as jwt.JwtPayload;
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT verification error:", err);
    return ApiResponse.error(res, "Invalid or expired token", 401);
  }
};

export const registerValidation = (req: Request, res: Response, next: NextFunction) => {
  const email = req.body.email?.trim();
  const username = req.body.username?.trim();
  const password = req.body.password;

  if (!email || !username || !password) {
    return ApiResponse.error(res, "All fields are required", 400);
  }

  if (!/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(email)) {
    return ApiResponse.error(res, "Invalid email format", 400);
  }

  if (username.length < 3 || username.length > 20) {
    return ApiResponse.error(res, "Username must be between 3 and 20 characters", 400);
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return ApiResponse.error(res, "Username can only contain letters, numbers, and underscores", 400);
  }

  if (!/(?=.*[A-Z])(?=.*\d).{8,}/.test(password)) {
    return ApiResponse.error(
      res,
      "Password must be at least 8 characters, include a number and an uppercase letter",
      400,
    );
  }

  next();
};

export const loginValidation = (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return ApiResponse.error(res, "Username and password are required", 400);
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return ApiResponse.error(res, "Invalid username format", 400);
  }

  next();
};
