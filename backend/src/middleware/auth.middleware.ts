import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ApiResponse } from "../utils/apiResponse";

export const auth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const header = req.headers.authorization;
    if (!header) {
      return ApiResponse.unauthorized(res, "No authorization header");
    }

    const token = header.split(" ")[1];
    if (!token) {
      return ApiResponse.unauthorized(res, "Token missing");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (error) {
    return ApiResponse.unauthorized(res, "Invalid or expired token");
  }
};