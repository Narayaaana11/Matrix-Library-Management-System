const { body, param, query, validationResult } = require('express-validator');

// Validation rules
const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Password is required'),
];

const validateCreateBook = [
  body('title')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Title is required'),
  body('author')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Author is required'),
  body('isbn')
    .optional()
    .trim(),
  body('isnn')
    .optional()
    .trim(),
  body('copies')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Copies must be a positive number'),
  body('available')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Available count must be non-negative'),
  body('categories')
    .optional()
    .isArray()
    .withMessage('Categories must be an array'),
  body('status')
    .optional()
    .isIn(['Available', 'Out of Stock', 'In Repair', 'Archived', 'Lost'])
    .withMessage('Invalid book status'),
];

const validateUpdateBook = [
  param('id')
    .notEmpty()
    .withMessage('Book ID is required'),
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Title must not be empty'),
  body('author')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Author must not be empty'),
  body('status')
    .optional()
    .isIn(['Available', 'Out of Stock', 'In Repair', 'Archived', 'Lost'])
    .withMessage('Invalid book status'),
];

const validateBorrowRecord = [
  body('bookId')
    .trim()
    .notEmpty()
    .withMessage('Book ID is required'),
  body('studentId')
    .trim()
    .notEmpty()
    .withMessage('Student ID is required'),
  body('borrowDate')
    .optional()
    .isISO8601()
    .withMessage('Borrow date must be a valid date'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid date'),
];

const validateReturnBook = [
  param('id')
    .notEmpty()
    .withMessage('Borrow record ID is required'),
];

const validateExtendPeriod = [
  param('id')
    .notEmpty()
    .withMessage('Borrow record ID is required'),
  body('days')
    .optional()
    .isInt({ min: 1, max: 30 })
    .withMessage('Extension days must be between 1 and 30'),
];

const validateBookById = [
  param('id')
    .notEmpty()
    .withMessage('Book ID is required'),
];

const validateBookByISBN = [
  param('isbn')
    .trim()
    .notEmpty()
    .withMessage('ISBN is required'),
];

const validateStudentId = [
  param('studentId')
    .trim()
    .notEmpty()
    .withMessage('Student ID is required'),
];

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(err => ({
      field: err.param,
      message: err.msg,
      value: err.value,
      location: err.location
    }));

    return res.status(400).json({
      success: false,
      status: 'fail',
      statusCode: 400,
      message: 'Validation failed',
      errors: formattedErrors
    });
  }
  next();
};

// Input sanitization middleware
const sanitizeInput = (req, res, next) => {
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        // Remove leading/trailing whitespace
        req.body[key] = req.body[key].trim();
        // Prevent XSS attacks
        req.body[key] = req.body[key].replace(/[<>]/g, '');
      }
    });
  }
  next();
};

module.exports = {
  validateLogin,
  validateCreateBook,
  validateUpdateBook,
  validateBorrowRecord,
  validateReturnBook,
  validateExtendPeriod,
  validateBookById,
  validateBookByISBN,
  validateStudentId,
  handleValidationErrors,
  sanitizeInput,
};
