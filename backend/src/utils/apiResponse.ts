import { Response } from "express";

export interface ApiSuccessResponse<T = any> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    message: string;
    details?: any;
  };
  statusCode: number;
}

export class ApiResponse {
  /**
   * Send a successful response
   */
  static success<T>(
    res: Response,
    data: T,
    message?: string,
    statusCode: number = 200
  ): Response {
    const response: ApiSuccessResponse<T> = {
      success: true,
      data,
      ...(message && { message }),
    };
    return res.status(statusCode).json(response);
  }

  /**
   * Send an error response
   */
  static error(
    res: Response,
    message: string,
    statusCode: number = 500,
    details?: any
  ): Response {
    const response: ApiErrorResponse = {
      success: false,
      error: {
        message,
        ...(details && { details }),
      },
      statusCode,
    };
    return res.status(statusCode).json(response);
  }

  /**
   * Send a validation error response
   */
  static validationError(
    res: Response,
    errors: any[],
    message: string = "Validation failed"
  ): Response {
    return ApiResponse.error(res, message, 400, errors);
  }

  /**
   * Send a not found response
   */
  static notFound(res: Response, message: string = "Resource not found"): Response {
    return ApiResponse.error(res, message, 404);
  }

  /**
   * Send an unauthorized response
   */
  static unauthorized(
    res: Response,
    message: string = "Unauthorized access"
  ): Response {
    return ApiResponse.error(res, message, 401);
  }

  /**
   * Send a forbidden response
   */
  static forbidden(
    res: Response,
    message: string = "Forbidden access"
  ): Response {
    return ApiResponse.error(res, message, 403);
  }
}
