/**
 * Format date to ISO string
 */
export const formatDate = (date) => {
  return new Date(date).toISOString().split('T')[0];
};

/**
 * Format date with time
 */
export const formatDateTime = (date) => {
  return new Date(date).toISOString();
};

/**
 * Get start of day
 */
export const getStartOfDay = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * Get end of day
 */
export const getEndOfDay = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

/**
 * Get start of week
 */
export const getStartOfWeek = (date = new Date()) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff));
};

/**
 * Get start of month
 */
export const getStartOfMonth = (date = new Date()) => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

/**
 * Get end of month
 */
export const getEndOfMonth = (date = new Date()) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};

/**
 * Add days to date
 */
export const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * Subtract days from date
 */
export const subtractDays = (date, days) => {
  return addDays(date, -days);
};

/**
 * Check if date is today
 */
export const isToday = (date) => {
  const today = new Date();
  const checkDate = new Date(date);
  return checkDate.toDateString() === today.toDateString();
};

/**
 * Check if date is in the past
 */
export const isPastDate = (date) => {
  return new Date(date) < new Date();
};

/**
 * Get days between two dates
 */
export const daysBetween = (date1, date2) => {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round(Math.abs((new Date(date1) - new Date(date2)) / oneDay));
};

/**
 * Format relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + ' years ago';

  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + ' months ago';

  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + ' days ago';

  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + ' hours ago';

  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + ' minutes ago';

  return Math.floor(seconds) + ' seconds ago';
};