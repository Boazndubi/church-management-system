import jwt from 'jsonwebtoken';
import { JWT_CONFIG } from '../config/constants.js';

/**
 * Verify JWT token from request headers
 */
export const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'No token provided',
        code: 'NO_TOKEN'
      });
    }

    const decoded = jwt.verify(token, JWT_CONFIG.secret);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'error',
        message: 'Token has expired',
        code: 'TOKEN_EXPIRED'
      });
    }

    return res.status(401).json({
      status: 'error',
      message: 'Invalid token',
      code: 'INVALID_TOKEN'
    });
  }
};

/**
 * Check if user has required role
 */
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'User not authenticated',
        code: 'NOT_AUTHENTICATED'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'Insufficient permissions',
        code: 'INSUFFICIENT_PERMISSIONS',
        requiredRoles: allowedRoles,
        userRole: req.user.role
      });
    }

    next();
  };
};

/**
 * Check if user has required permission
 */
export const requirePermission = (...allowedPermissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'User not authenticated',
        code: 'NOT_AUTHENTICATED'
      });
    }

    const userPermissions = req.user.permissions || [];
    const hasPermission = allowedPermissions.some(perm => 
      userPermissions.includes(perm)
    );

    if (!hasPermission) {
      return res.status(403).json({
        status: 'error',
        message: 'Permission denied',
        code: 'PERMISSION_DENIED',
        requiredPermissions: allowedPermissions
      });
    }

    next();
  };
};

/**
 * Optional authentication - doesn't fail if no token
 */
export const optionalAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, JWT_CONFIG.secret);
      req.user = decoded;
    }

    next();
  } catch (error) {
    // Continue without user
    next();
  }
};