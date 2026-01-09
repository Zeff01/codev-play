import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Request, Response, NextFunction } from "express";
import { createUser, findUser } from "../models/user.model";
import { ApiResponse } from "../utils/apiResponse";
import AppError from "../middleware/AppError";

interface registerBody {
  email: string;
  username: string;
  password: string;
}

export const register = async (
  req: Request<{}, {}, registerBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, username, password } = req.body;

    // Check if user already exists
    const userExist = await findUser(email, username);
    if (userExist) {
      return ApiResponse.error(res, "User already exists", 400);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await createUser(email, username, hashedPassword);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser;

    return ApiResponse.success(
      res,
      { user: userWithoutPassword },
      "User registered successfully",
      201
    );
  } catch (error) {
    next(new AppError("Registration failed", 500));
  }
};

export const login = async (
  req: Request<{}, {}, { username: string; password: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = await findUser("", username);
    if (!user) {
      return ApiResponse.error(res, "Invalid credentials", 401);
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return ApiResponse.error(res, "Invalid credentials", 401);
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return ApiResponse.success(
      res,
      { token, user: userWithoutPassword },
      "Login successful"
    );
  } catch (error) {
    next(new AppError("Login failed", 500));
  }
};