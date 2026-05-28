import bcrypt from 'bcryptjs';
import { VALIDATION_RULES } from '../config/constants.js';

/**
 * Hash password
 */
export const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    console.error('Error hashing password:', error);
    throw new Error('Failed to hash password');
  }
};

/**
 * Compare password with hash
 */
export const comparePassword = async (password, hash) => {
  try {
    const isMatch = await bcrypt.compare(password, hash);
    return isMatch;
  } catch (error) {
    console.error('Error comparing password:', error);
    throw new Error('Failed to compare password');
  }
};

/**
 * Validate password strength
 */
export const validatePasswordStrength = (password) => {
  const rules = VALIDATION_RULES.password;
  const errors = [];

  if (password.length < rules.minLength) {
    errors.push(`Password must be at least ${rules.minLength} characters`);
  }

  if (rules.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain uppercase letter');
  }

  if (rules.requireNumbers && !/[0-9]/.test(password)) {
    errors.push('Password must contain number');
  }

  if (rules.requireSpecialChars && !/[!@#$%^&*]/.test(password)) {
    errors.push('Password must contain special character');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Generate random password
 */
export const generateRandomPassword = (length = 12) => {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const special = '!@#$%^&*';

  const allChars = uppercase + lowercase + numbers + special;
  let password = '';

  // Ensure at least one of each type
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];

  // Fill rest randomly
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle password
  return password.split('').sort(() => Math.random() - 0.5).join('');
};