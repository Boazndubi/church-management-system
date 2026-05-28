import { HTTP_STATUS, MESSAGES } from '../config/constants.js';

/**
 * Send success response
 */
export const sendSuccess = (res, data = null, message = MESSAGES.SUCCESS, statusCode = HTTP_STATUS.OK) => {
  res.status(statusCode).json({
    status: 'success',
    message,
    data,
    timestamp: new Date().toISOString()
  });
};

/**
 * Send paginated response
 */
export const sendPaginatedSuccess = (
  res,
  data = [],
  pagination = {},
  message = MESSAGES.SUCCESS,
  statusCode = HTTP_STATUS.OK
) => {
  res.status(statusCode).json({
    status: 'success',
    message,
    data,
    pagination: {
      page: pagination.page || 1,
      limit: pagination.limit || 10,
      total: pagination.total || 0,
      pages: Math.ceil((pagination.total || 0) / (pagination.limit || 10)),
      hasMore: (pagination.page || 1) < Math.ceil((pagination.total || 0) / (pagination.limit || 10))
    },
    timestamp: new Date().toISOString()
  });
};

/**
 * Send error response
 */
export const sendError = (res, message = MESSAGES.SERVER_ERROR, statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, code = 'ERROR') => {
  res.status(statusCode).json({
    status: 'error',
    message,
    code,
    timestamp: new Date().toISOString()
  });
};

/**
 * Send validation error
 */
export const sendValidationError = (res, errors = [], message = MESSAGES.VALIDATION_ERROR) => {
  res.status(HTTP_STATUS.BAD_REQUEST).json({
    status: 'error',
    message,
    code: 'VALIDATION_ERROR',
    errors,
    timestamp: new Date().toISOString()
  });
};

/**
 * Send created response
 */
export const sendCreated = (res, data, message = MESSAGES.CREATED) => {
  sendSuccess(res, data, message, HTTP_STATUS.CREATED);
};

/**
 * Send unauthorized response
 */
export const sendUnauthorized = (res, message = MESSAGES.UNAUTHORIZED, code = 'UNAUTHORIZED') => {
  sendError(res, message, HTTP_STATUS.UNAUTHORIZED, code);
};

/**
 * Send forbidden response
 */
export const sendForbidden = (res, message = MESSAGES.FORBIDDEN, code = 'FORBIDDEN') => {
  sendError(res, message, HTTP_STATUS.FORBIDDEN, code);
};

/**
 * Send not found response
 */
export const sendNotFound = (res, message = MESSAGES.NOT_FOUND, code = 'NOT_FOUND') => {
  sendError(res, message, HTTP_STATUS.NOT_FOUND, code);
};

/**
 * Send conflict response
 */
export const sendConflict = (res, message = MESSAGES.ALREADY_EXISTS, code = 'CONFLICT') => {
  sendError(res, message, HTTP_STATUS.CONFLICT, code);
};