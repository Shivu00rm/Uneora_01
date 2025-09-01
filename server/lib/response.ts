import type { Request, Response, NextFunction } from "express";
import { randomUUID } from "crypto";

export type ApiSuccess<T = any> = { success: true; data: T; requestId: string };
export type ApiError = {
  success: false;
  code: string;
  message: string;
  details?: any;
  requestId: string;
  retryable?: boolean;
};

export function attachRequestId(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  (req as any).requestId = req.headers["x-request-id"] || randomUUID();
  next();
}

export function success<T>(req: Request, res: Response, data: T, status = 200) {
  const body: ApiSuccess<T> = {
    success: true,
    data,
    requestId: (req as any).requestId,
  };
  res.status(status).json(body);
}

export function error(
  req: Request,
  res: Response,
  code: string,
  message: string,
  details?: any,
  status = 400,
  retryable = false,
) {
  const body: ApiError = {
    success: false,
    code,
    message,
    details,
    requestId: (req as any).requestId,
    retryable,
  };
  res.status(status).json(body);
}

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  const msg = err?.message || "Internal Server Error";
  const details = err?.details || undefined;
  error(req, res, "INTERNAL_ERROR", msg, details, 500, false);
}
