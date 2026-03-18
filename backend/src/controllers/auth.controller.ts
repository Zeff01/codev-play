import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Request, Response, NextFunction } from "express";
import logger from "@/utils/logger";
import {
    createUser,
    findUserByEmail,
    findUserByLogin,
    findUserByUsername,
} from "@/models/user.model";
import { ApiResponse } from "@/utils/api-response";
import AppError from "@/middleware/app-error";

interface RegisterBody {
    email: string;
    username: string;
    password: string;
}

export const register = async (
    req: Request<{}, {}, RegisterBody>,
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
    req: Request<{}, {}, { email: string; password: string }>,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { email, password } = req.body;
        logger.info(`Login attempt for: ${email}`);
        const user = await findUserByLogin(email);
        logger.info(
            `User lookup result for ${email}: ${user ? `id=${user.id}` : "not found"}`,
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
            { id: user.id, email: user.email },
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

export const logout = (req: Request, res: Response) => {
    const isProd = process.env.NODE_ENV === "production";

    res.clearCookie("token", {
        httpOnly: true,
        secure: isProd,
        sameSite: "strict",
        path: "/",
      });
    } catch (error) {
      console.error("Failed to set auth cookie:", error);
    }

    const { password: _, ...userWithoutPassword } = user;

    return ApiResponse.success(
      res,
      { user: userWithoutPassword, token },
      "Login successful",
    );
    // Return token in local development for easier testing
  } catch (error) {
    next(new AppError("Login failed", 500));
  }
};

    return res.status(200).json({
        message: "Logged out successfully",
    });
};
