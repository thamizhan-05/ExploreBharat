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

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  const statusCode = err.statusCode || (err.name === 'ZodError' ? 400 : (err.name === 'ValidationError' ? 422 : 500));
  const message = err.name === 'ZodError' 
    ? (err.issues?.[0]?.message ? `Validation error: ${err.issues[0].message} at ${err.issues[0].path.join('.')}` : 'Validation error')
    : (err.message || 'Internal server error');
  const errors = err.errors || (err.issues ? err.issues.map((i: any) => i.message) : undefined);

  if (process.env.NODE_ENV !== 'production' && statusCode === 500) {
    console.error('Unhandled Server Error:', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors,
    ...(process.env.NODE_ENV === 'development' && statusCode === 500 ? { stack: err.stack } : {})
  });
}
