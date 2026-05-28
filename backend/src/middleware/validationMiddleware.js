import { body, param, query, validationResult } from 'express-validator';
import { MESSAGES, HTTP_STATUS } from '../config/constants.js';

/**
 * Validation error handler
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: 'error',
      message: MESSAGES.VALIDATION_ERROR,
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg,
        value: err.value
      }))
    });
  }

  next();
};

// ============================================================================
// COMMON VALIDATION RULES
// ============================================================================

export const validateEmail = () =>
  body('email')
    .trim()
    .isEmail()
    .withMessage('Invalid email address')
    .normalizeEmail();

export const validatePassword = () =>
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain uppercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain number')
    .matches(/[!@#$%^&*]/)
    .withMessage('Password must contain special character');

export const validatePhone = () =>
  body('phoneNumber')
    .optional()
    .isMobilePhone()
    .withMessage('Invalid phone number');

export const validateId = () =>
  param('id')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('ID is required');

export const validatePagination = () => [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be >= 1')
    .toInt(),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
    .toInt()
];

// ============================================================================
// MEMBER VALIDATION
// ============================================================================

export const validateCreateMember = [
  body('email').isEmail().withMessage('Invalid email'),
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('phoneNumber').optional().isMobilePhone().withMessage('Invalid phone'),
  body('dateOfBirth').optional().isISO8601().withMessage('Invalid date'),
  body('gender').optional().isIn(['MALE', 'FEMALE', 'OTHER']).withMessage('Invalid gender'),
  body('maritalStatus').optional().isIn(['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED']).withMessage('Invalid marital status'),
  handleValidationErrors
];

export const validateUpdateMember = [
  body('firstName').optional().trim().notEmpty().withMessage('First name cannot be empty'),
  body('lastName').optional().trim().notEmpty().withMessage('Last name cannot be empty'),
  body('phoneNumber').optional().isMobilePhone().withMessage('Invalid phone'),
  body('dateOfBirth').optional().isISO8601().withMessage('Invalid date'),
  body('gender').optional().isIn(['MALE', 'FEMALE', 'OTHER']).withMessage('Invalid gender'),
  body('maritalStatus').optional().isIn(['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED']).withMessage('Invalid marital status'),
  handleValidationErrors
];

// ============================================================================
// SERVICE VALIDATION
// ============================================================================

export const validateCreateService = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('serviceType').isIn(['SUNDAY_SERVICE', 'MIDWEEK_SERVICE', 'SPECIAL_EVENT', 'PRAYER_MEETING', 'YOUTH_MEETING']).withMessage('Invalid service type'),
  body('date').isISO8601().withMessage('Invalid date'),
  body('startTime').isISO8601().withMessage('Invalid start time'),
  body('endTime').isISO8601().withMessage('Invalid end time'),
  body('venue').trim().notEmpty().withMessage('Venue is required'),
  handleValidationErrors
];

// ============================================================================
// CONTRIBUTION VALIDATION
// ============================================================================

export const validateCreateContribution = [
  body('memberId').isString().notEmpty().withMessage('Member ID is required'),
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
  body('type').isIn(['TITHE', 'OFFERING', 'BUILDING_FUND', 'MISSION', 'OTHER']).withMessage('Invalid contribution type'),
  body('paymentMethod').isIn(['CASH', 'MPESA', 'BANK_TRANSFER', 'CHEQUE', 'ONLINE']).withMessage('Invalid payment method'),
  handleValidationErrors
];

// ============================================================================
// ATTENDANCE VALIDATION
// ============================================================================

export const validateRecordAttendance = [
  body('memberId').isString().notEmpty().withMessage('Member ID is required'),
  body('serviceId').isString().notEmpty().withMessage('Service ID is required'),
  body('status').isIn(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED']).withMessage('Invalid attendance status'),
  handleValidationErrors
];