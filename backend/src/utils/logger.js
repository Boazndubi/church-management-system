import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { LOG_CONFIG } from '../config/constants.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logsDir = path.join(__dirname, '../../logs');

// Ensure logs directory exists
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const getLogFile = () => {
  const date = new Date().toISOString().split('T')[0];
  return path.join(logsDir, `${date}.log`);
};

/**
 * Write log to file
 */
const writeLogToFile = (level, message, data = null) => {
  const timestamp = new Date().toISOString();
  const logMessage = data 
    ? `[${timestamp}] ${level}: ${message} ${JSON.stringify(data)}` 
    : `[${timestamp}] ${level}: ${message}`;
  
  try {
    fs.appendFileSync(getLogFile(), logMessage + '\n');
  } catch (error) {
    console.error('Failed to write log:', error);
  }
};

/**
 * Info logger
 */
export const info = (message, data = null) => {
  console.log(`ℹ️  INFO: ${message}`, data || '');
  writeLogToFile('INFO', message, data);
};

/**
 * Success logger
 */
export const success = (message, data = null) => {
  console.log(`✅ SUCCESS: ${message}`, data || '');
  writeLogToFile('SUCCESS', message, data);
};

/**
 * Warning logger
 */
export const warn = (message, data = null) => {
  console.warn(`⚠️  WARN: ${message}`, data || '');
  writeLogToFile('WARN', message, data);
};

/**
 * Error logger
 */
export const error = (message, errorObj = null) => {
  const errorData = errorObj instanceof Error 
    ? { message: errorObj.message, stack: errorObj.stack }
    : errorObj;
  
  console.error(`❌ ERROR: ${message}`, errorData || '');
  writeLogToFile('ERROR', message, errorData);
};

/**
 * Debug logger
 */
export const debug = (message, data = null) => {
  if (LOG_CONFIG.level === 'debug') {
    console.log(`🔍 DEBUG: ${message}`, data || '');
    writeLogToFile('DEBUG', message, data);
  }
};

/**
 * API request logger
 */
export const logRequest = (method, path, statusCode, duration) => {
  const message = `${method} ${path} - ${statusCode} (${duration}ms)`;
  info(message);
};

/**
 * Database query logger
 */
export const logQuery = (query, duration) => {
  debug(`Query executed in ${duration}ms: ${query}`);
};

export default {
  info,
  success,
  warn,
  error,
  debug,
  logRequest,
  logQuery
};