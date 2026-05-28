import { HTTP_STATUS, MESSAGES } from '../config/constants.js';

// Simple in-memory rate limiter (for development)
// For production, use redis-based rate limiting
const requestCounts = new Map();

/**
 * Generic rate limiter
 */
export const rateLimit = (options = {}) => {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutes
    maxRequests = 100,
    keyGenerator = (req) => req.ip || req.connection.remoteAddress,
    message = 'Too many requests, please try again later'
  } = options;

  return (req, res, next) => {
    const key = keyGenerator(req);
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean up old entries
    if (!requestCounts.has(key)) {
      requestCounts.set(key, []);
    }

    const requests = requestCounts.get(key);
    const recentRequests = requests.filter(time => time > windowStart);

    if (recentRequests.length >= maxRequests) {
      return res.status(HTTP_STATUS.TOO_MANY_REQUESTS || 429).json({
        status: 'error',
        message,
        code: 'RATE_LIMIT_EXCEEDED',
        retryAfter: Math.ceil((recentRequests[0] + windowMs - now) / 1000)
      });
    }

    recentRequests.push(now);
    requestCounts.set(key, recentRequests);
    next();
  };
};

/**
 * Strict rate limiter for auth endpoints
 */
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5,
  message: 'Too many login attempts, please try again later'
});

/**
 * Standard rate limiter for API endpoints
 */
export const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100,
  message: 'Too many requests'
});

/**
 * Loose rate limiter for public endpoints
 */
export const publicRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 30,
  message: 'Too many requests'
});