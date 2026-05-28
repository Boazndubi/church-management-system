  // ============================================================================
// APPLICATION CONSTANTS
// ============================================================================

export const APP_CONFIG = {
  name: process.env.APP_NAME || 'Church Management System',
  version: '1.0.0',
  environment: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173'
};

// ============================================================================
// JWT CONFIGURATION
// ============================================================================

export const JWT_CONFIG = {
  secret: process.env.JWT_SECRET || 'your_super_secret_jwt_key',
  expire: process.env.JWT_EXPIRE || '7d',
  algorithm: 'HS256'
};

// ============================================================================
// DATABASE CONFIGURATION
// ============================================================================

export const DATABASE_CONFIG = {
  url: process.env.DATABASE_URL || 'postgresql://postgres:password123@localhost:5432/church_management_db',
  maxConnections: 20,
  minConnections: 2,
  idleTimeout: 30000
};

// ============================================================================
// USER ROLES
// ============================================================================

export const USER_ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ARCHBISHOP: 'ARCHBISHOP',
  BISHOP: 'BISHOP',
  OVERSEER: 'OVERSEER',
  SENIOR_PASTOR: 'SENIOR_PASTOR',
  PASTOR: 'PASTOR',
  DEPARTMENT_PASTOR: 'DEPARTMENT_PASTOR',
  ATTENDANCE_MANAGER: 'ATTENDANCE_MANAGER',
  MEMBER: 'MEMBER'
};

// Role hierarchy (higher number = more privileges)
export const ROLE_HIERARCHY = {
  MEMBER: 1,
  ATTENDANCE_MANAGER: 2,
  DEPARTMENT_PASTOR: 3,
  PASTOR: 4,
  SENIOR_PASTOR: 5,
  OVERSEER: 6,
  BISHOP: 7,
  ARCHBISHOP: 8,
  SUPER_ADMIN: 9
};

// ============================================================================
// SERVICE TYPES
// ============================================================================

export const SERVICE_TYPES = {
  SUNDAY_SERVICE: 'SUNDAY_SERVICE',
  MIDWEEK_SERVICE: 'MIDWEEK_SERVICE',
  SPECIAL_EVENT: 'SPECIAL_EVENT',
  PRAYER_MEETING: 'PRAYER_MEETING',
  YOUTH_MEETING: 'YOUTH_MEETING'
};

// ============================================================================
// CONTRIBUTION TYPES
// ============================================================================

export const CONTRIBUTION_TYPES = {
  TITHE: 'TITHE',
  OFFERING: 'OFFERING',
  BUILDING_FUND: 'BUILDING_FUND',
  MISSION: 'MISSION',
  OTHER: 'OTHER'
};

// ============================================================================
// PAYMENT METHODS
// ============================================================================

export const PAYMENT_METHODS = {
  CASH: 'CASH',
  MPESA: 'MPESA',
  BANK_TRANSFER: 'BANK_TRANSFER',
  CHEQUE: 'CHEQUE',
  ONLINE: 'ONLINE'
};

// ============================================================================
// ATTENDANCE STATUS
// ============================================================================

export const ATTENDANCE_STATUS = {
  PRESENT: 'PRESENT',
  ABSENT: 'ABSENT',
  LATE: 'LATE',
  EXCUSED: 'EXCUSED'
};

// ============================================================================
// M-PESA CONFIGURATION
// ============================================================================

export const MPESA_CONFIG = {
  consumerKey: process.env.MPESA_CONSUMER_KEY || '',
  consumerSecret: process.env.MPESA_CONSUMER_SECRET || '',
  passkey: process.env.MPESA_PASSKEY || '',
  accountReference: process.env.MPESA_ACCOUNT_REFERENCE || 'CHURCH',
  phoneNumber: process.env.MPESA_PHONE_NUMBER || '254712345678',
  businessShortCode: '174379',
  initiatorName: 'testapi',
  securityCredential: '', // Will be encrypted
  commandId: 'CustomerPayBillOnline',
  timeout: 30000
};

// ============================================================================
// BANK API CONFIGURATION
// ============================================================================

export const BANK_API_CONFIG = {
  apiKey: process.env.BANK_API_KEY || '',
  apiSecret: process.env.BANK_API_SECRET || '',
  baseUrl: 'https://api.banking.example.com',
  timeout: 30000
};

// ============================================================================
// WHATSAPP CONFIGURATION
// ============================================================================

export const WHATSAPP_CONFIG = {
  businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || '',
  phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
  apiToken: process.env.WHATSAPP_API_TOKEN || '',
  apiUrl: 'https://graph.instagram.com/v17.0',
  timeout: 30000
};

// ============================================================================
// EMAIL CONFIGURATION
// ============================================================================

export const EMAIL_CONFIG = {
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  user: process.env.EMAIL_USER || '',
  password: process.env.EMAIL_PASSWORD || '',
  from: 'noreply@churchmanagement.com',
  replyTo: 'support@churchmanagement.com'
};

// ============================================================================
// FILE UPLOAD CONFIGURATION
// ============================================================================

export const FILE_CONFIG = {
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880'), // 5MB
  uploadDir: process.env.UPLOAD_DIR || './uploads',
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  allowedDocTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.doc', '.docx']
};

// ============================================================================
// VALIDATION RULES
// ============================================================================

export const VALIDATION_RULES = {
  password: {
    minLength: 8,
    requireUppercase: true,
    requireNumbers: true,
    requireSpecialChars: true
  },
  phone: {
    minLength: 10,
    maxLength: 15,
    pattern: /^[0-9+\-\s()]+$/
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  }
};

// ============================================================================
// API RESPONSE MESSAGES
// ============================================================================

export const MESSAGES = {
  // Success
  SUCCESS: 'Operation successful',
  CREATED: 'Resource created successfully',
  UPDATED: 'Resource updated successfully',
  DELETED: 'Resource deleted successfully',

  // Authentication
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  INVALID_CREDENTIALS: 'Invalid email or password',
  TOKEN_EXPIRED: 'Token has expired',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',

  // Validation
  VALIDATION_ERROR: 'Validation error',
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Invalid email address',
  INVALID_PHONE: 'Invalid phone number',
  PASSWORD_MISMATCH: 'Passwords do not match',

  // Database
  NOT_FOUND: 'Resource not found',
  ALREADY_EXISTS: 'Resource already exists',
  DATABASE_ERROR: 'Database error',

  // Server
  SERVER_ERROR: 'Internal server error',
  BAD_REQUEST: 'Bad request',
  METHOD_NOT_ALLOWED: 'Method not allowed',

  // Business Logic
  INSUFFICIENT_BALANCE: 'Insufficient balance',
  DUPLICATE_ENTRY: 'Duplicate entry',
  OPERATION_FAILED: 'Operation failed'
};

// ============================================================================
// HTTP STATUS CODES
// ============================================================================

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
};

// ============================================================================
// PAGINATION
// ============================================================================

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
  MIN_LIMIT: 1
};

// ============================================================================
// LOGGING
// ============================================================================

export const LOG_CONFIG = {
  level: process.env.LOG_LEVEL || 'debug',
  file: process.env.LOG_FILE || 'logs/app.log',
  maxSize: '10m',
  maxFiles: 10
};

// ============================================================================
// CACHE CONFIGURATION
// ============================================================================

export const CACHE_CONFIG = {
  enabled: true,
  defaultTTL: 300, // 5 minutes in seconds
  userCacheTTL: 600, // 10 minutes
  memberCacheTTL: 300, // 5 minutes
  serviceCacheTTL: 3600 // 1 hour
};

// ============================================================================
// FEATURE FLAGS
// ============================================================================

export const FEATURE_FLAGS = {
  enableMpesa: true,
  enableBankIntegration: true,
  enableWhatsApp: true,
  enableEmailNotifications: false,
  enableSMSNotifications: false,
  enableAnalytics: true,
  maintenanceMode: false
};

// ============================================================================
// PERMISSIONS
// ============================================================================

export const PERMISSIONS = {
  // Member Management
  VIEW_MEMBERS: 'view_members',
  CREATE_MEMBER: 'create_member',
  EDIT_MEMBER: 'edit_member',
  DELETE_MEMBER: 'delete_member',

  // Attendance
  VIEW_ATTENDANCE: 'view_attendance',
  RECORD_ATTENDANCE: 'record_attendance',
  EDIT_ATTENDANCE: 'edit_attendance',

  // Contributions
  VIEW_CONTRIBUTIONS: 'view_contributions',
  RECORD_CONTRIBUTION: 'record_contribution',
  EDIT_CONTRIBUTION: 'edit_contribution',
  VIEW_REPORTS: 'view_reports',

  // Services
  CREATE_SERVICE: 'create_service',
  EDIT_SERVICE: 'edit_service',
  DELETE_SERVICE: 'delete_service',

  // Departments
  VIEW_DEPARTMENTS: 'view_departments',
  MANAGE_DEPARTMENTS: 'manage_departments',

  // Admin
  MANAGE_USERS: 'manage_users',
  MANAGE_ROLES: 'manage_roles',
  VIEW_LOGS: 'view_logs',
  SYSTEM_SETTINGS: 'system_settings'
};

export default {
  APP_CONFIG,
  JWT_CONFIG,
  DATABASE_CONFIG,
  USER_ROLES,
  ROLE_HIERARCHY,
  SERVICE_TYPES,
  CONTRIBUTION_TYPES,
  PAYMENT_METHODS,
  ATTENDANCE_STATUS,
  MPESA_CONFIG,
  BANK_API_CONFIG,
  WHATSAPP_CONFIG,
  EMAIL_CONFIG,
  FILE_CONFIG,
  VALIDATION_RULES,
  MESSAGES,
  HTTP_STATUS,
  PAGINATION,
  LOG_CONFIG,
  CACHE_CONFIG,
  FEATURE_FLAGS,
  PERMISSIONS
};
