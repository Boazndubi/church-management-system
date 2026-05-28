/**
 * Generate random string
 */
export const generateRandomString = (length = 10) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Generate unique ID
 */
export const generateId = (prefix = '') => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 15);
  return prefix ? `${prefix}_${timestamp}${randomStr}` : `${timestamp}${randomStr}`;
};

/**
 * Slugify string
 */
export const slugify = (str) => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Capitalize string
 */
export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Capitalize words in string
 */
export const capitalizeWords = (str) => {
  return str.replace(/\b\w/g, char => char.toUpperCase());
};

/**
 * Truncate string
 */
export const truncate = (str, length = 50, suffix = '...') => {
  if (str.length <= length) return str;
  return str.substring(0, length - suffix.length) + suffix;
};

/**
 * Format phone number (Kenya format)
 */
export const formatPhoneNumber = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.startsWith('0')) {
    return '254' + cleaned.substring(1);
  }
  
  if (cleaned.startsWith('254')) {
    return cleaned;
  }
  
  return '254' + cleaned;
};

/**
 * Validate phone number format
 */
export const isValidPhoneNumber = (phone) => {
  const pattern = /^(\+?254|0)[0-9]{9}$/;
  return pattern.test(phone);
};

/**
 * Mask email (for privacy)
 */
export const maskEmail = (email) => {
  const [name, domain] = email.split('@');
  const masked = name.substring(0, 2) + '*'.repeat(name.length - 3) + '@' + domain;
  return masked;
};

/**
 * Mask phone number
 */
export const maskPhoneNumber = (phone) => {
  return phone.substring(0, 3) + '*'.repeat(phone.length - 6) + phone.substring(phone.length - 3);
};