import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";
import {
    createUser,
    findUserByEmail,
    findUserByLogin,
    findUserByUsername,
} from "../models/user.model";
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
    next: NextFunction,
) => {
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

        return ApiResponse.success(
            res,
            { user: userWithoutPassword },
            "User registered successfully",
            201,
        );
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
        logger.info(`Login attempt for: ${username}`);
        const user = await findUserByLogin(username);
        logger.info(
            `User lookup result for ${username}: ${user ? `id=${user.id}` : "not found"}`,
        );
        if (!user) {
            return ApiResponse.error(res, "Invalid credentials", 401);
        }

        const isMatch = await bcrypt.compare(password, user.password);
        logger.info(`Password compare for user ${user.id}: ${isMatch}`);
        if (!isMatch) {
            return ApiResponse.error(res, "Invalid credentials", 401);
        }
        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET!,
            { expiresIn: "7d" },
        );

        try {
            const isProd = process.env.NODE_ENV === "production";
            // For local development (http), avoid `secure: true` and use a more permissive sameSite.
            res.cookie("token", token, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000,
                sameSite: isProd ? "none" : "lax",
                secure: isProd,
                path: "/",
            });
        } catch (error) {
            console.error("Failed to set auth cookie:", error);
        }

        const { password: _, ...userWithoutPassword } = user;

        return ApiResponse.success(
            res,
            { user: userWithoutPassword },
            "Login successful",
        );
    } catch (error) {
        next(new AppError("Login failed", 500));
    }
};
