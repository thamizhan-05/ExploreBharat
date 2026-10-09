import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  statusCode: number;
  errors?: string[];

  constructor(message: string, statusCode = 400, errors?: string[]) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export function errorHandler(err: any, req: Request, res: Response, _next: NextFunction) {
  // Translate Prisma errors
  let statusCode = err.statusCode;
  let customMessage: string | undefined = undefined;

  if (err.name === 'ZodError') {
    statusCode = 400;
  } else if (err.name === 'ValidationError') {
    statusCode = 422;
  } else if (err.code === 'P2002') {
    statusCode = 409;
    customMessage = 'A resource with this identifier already exists.';
  } else if (err.code === 'P2025') {
    statusCode = 404;
    customMessage = 'Requested resource was not found.';
  } else if (!statusCode) {
    statusCode = 500;
  }

  // Server-side logging captures full details
  if (statusCode >= 500) {
    console.error(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl || req.url} - Internal Server Error:`, err);
  } else if (process.env.NODE_ENV === 'development') {
    console.warn(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl || req.url} - Client Error (${statusCode}):`, err.message);
  }

  // Client message masking: in production, never leak 500 error details / database schemas / stack traces
  let message: string;
  if (err.name === 'ZodError') {
    message = err.issues?.[0]?.message
      ? `Validation error: ${err.issues[0].message} at ${err.issues[0].path.join('.')}`
      : 'Validation error';
  } else if (customMessage) {
    message = customMessage;
  } else if (statusCode === 500 && process.env.NODE_ENV === 'production') {
    message = 'An unexpected internal error occurred. Please try again later.';
  } else {
    message = err.message || 'Internal server error';
  }

  const errors = err.errors || (err.issues ? err.issues.map((i: any) => i.message) : undefined);

  res.status(statusCode).json({
    success: false,
    message,
    errors,
    ...(process.env.NODE_ENV === 'development' && statusCode === 500 ? { stack: err.stack } : {})
  });
}
