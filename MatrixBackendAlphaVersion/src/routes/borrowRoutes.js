const express = require('express');
const borrowController = require('../controllers/borrowController');
const authController = require('../controllers/authController');
const protect = require('../middleware/auth');
const restrictTo = require('../middleware/restrictTo');
const {
  validateBorrowRecord,
  validateReturnBook,
  validateExtendPeriod,
  validateStudentId,
  handleValidationErrors,
} = require('../middleware/validation');

const router = express.Router();

// Admin routes
router.use(protect);

router.get('/', restrictTo(['admin']), borrowController.getAllBorrowRecords);
router.post(
  '/borrow',
  restrictTo(['admin']),
  validateBorrowRecord,
  handleValidationErrors,
  borrowController.borrowBook
);
router.patch(
  '/:id/return',
  validateReturnBook,
  handleValidationErrors,
  borrowController.returnBook
);
router.patch('/:id', borrowController.updateBorrowRecord);
router.post('/:id/reminder', borrowController.sendEmailNotification);
router.patch(
  '/:id/extend',
  validateExtendPeriod,
  handleValidationErrors,
  borrowController.extendBorrowPeriod
);
router.patch('/:id/fine/paid', borrowController.markFinePaid);
router.patch('/:id/fine/waived', borrowController.waiveFine);
router.get(
  '/student/:studentId',
  validateStudentId,
  handleValidationErrors,
  restrictTo(['admin']),
  borrowController.getStudentBorrowHistoryByAdmin
);
router.get(
  '/daily-traffic',
  restrictTo(['admin']),
  borrowController.getDailyTraffic
);
router.get(
  '/admin-analytics',
  restrictTo(['admin']),
  borrowController.getAdminAnalytics
);

// Student route
router.get(
  '/student',
  restrictTo(['student']),
  borrowController.getStudentBorrowHistory
);

module.exports = router;