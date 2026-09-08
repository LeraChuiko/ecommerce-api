import type { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: Error & { status?: number; cause?: { status?: number } },
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  // Определяем статус ошибки (из err.status или err.cause.status, по умолчанию 500)
  const statusCode = err.status || err.cause?.status || 500;

  const message = err.message || 'Внутренняя ошибка сервера';

  res.status(statusCode).json({
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
