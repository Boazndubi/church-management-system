import jwt from 'jsonwebtoken';
import { JWT_CONFIG } from '../config/constants.js';

/**
 * Generate JWT token
 */
export const generateToken = (payload) => {
  try {
    const token = jwt.sign(payload, JWT_CONFIG.secret, {
      expiresIn: JWT_CONFIG.expire,
      algorithm: JWT_CONFIG.algorithm
    });
    return token;
  } catch (error) {
    console.error('Error generating token:', error);
    throw new Error('Failed to generate token');
  }
};

/**
 * Verify JWT token
 */
export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_CONFIG.secret);
    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token has expired');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    }
    throw error;
  }
};

/**
 * Decode JWT token without verifying
 */
export const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    throw new Error('Failed to decode token');
  }
};

/**
 * Create authentication payload
 */
export const createAuthPayload = (user) => {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    permissions: user.permissions || [],
    iat: Math.floor(Date.now() / 1000)
  };
};

/**
 * Create refresh token
 */
export const generateRefreshToken = (userId) => {
  const payload = { userId, type: 'refresh' };
  return jwt.sign(payload, JWT_CONFIG.secret, {
    expiresIn: '30d'
  });
};