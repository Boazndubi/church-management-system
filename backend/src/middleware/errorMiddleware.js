import { HTTP_STATUS } from '../config/constants.js';

/**
 * Custom error class
 */
export class AppError extends Error {
  constructor(message, statusCode = 500, code = 'ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Global error handler middleware
 */
export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  err.message = err.message || 'Internal Server Error';
  err.code = err.code || 'INTERNAL_SERVER_ERROR';

  // Log error
  console.error({
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method,
    statusCode: err.statusCode,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });

  // Prisma validation error
  if (err.code === 'P2002') {
    const target = err.meta?.target?.[0] || 'field';
    return res.status(HTTP_STATUS.CONFLICT).json({
      status: 'error',
      message: `${target} already exists`,
      code: 'DUPLICATE_ENTRY',
      statusCode: HTTP_STATUS.CONFLICT
    });
  }

  // Prisma record not found
  if (err.code === 'P2025') {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      status: 'error',
      message: 'Record not found',
      code: 'NOT_FOUND',
      statusCode: HTTP_STATUS.NOT_FOUND
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      status: 'error',
      message: 'Invalid token',
      code: 'INVALID_TOKEN',
      statusCode: HTTP_STATUS.UNAUTHORIZED
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      status: 'error',
      message: 'Token expired',
      code: 'TOKEN_EXPIRED',
      statusCode: HTTP_STATUS.UNAUTHORIZED
    });
  }

  // Default error response
  res.status(err.statusCode).json({
    status: 'error',
    message: err.message,
    code: err.code,
    statusCode: err.statusCode,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

/**
 * Async handler wrapper to catch errors in async routes
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * 404 handler
 */
export const notFoundHandler = (req, res, next) => {
  const error = new AppError(
    `Route ${req.method} ${req.path} not found`,
    HTTP_STATUS.NOT_FOUND,
    'ROUTE_NOT_FOUND'
  );
  next(error);
};