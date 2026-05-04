const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");
const {
  validateCreateBook,
  validateUpdateBook,
  validateBookById,
  validateBookByISBN,
  handleValidationErrors,
} = require("../middleware/validation");

// Public routes
router.get("/", bookController.getBooksByQuery); // Updated to handle query parameters
router.get(
  "/id/:id",
  validateBookById,
  handleValidationErrors,
  bookController.fetchBookById
); // New route for Book.id lookup
router.get(
  "/isbn/:isbn",
  validateBookByISBN,
  handleValidationErrors,
  bookController.fetchBookByISBN
);
router.get("/isnn/:isnn", bookController.fetchJournalByISNN);
router.get("/search/location", bookController.searchBooksWithLocation); // New route for location search

// Protected routes (assuming middleware for auth)
router.post(
  "/",
  validateCreateBook,
  handleValidationErrors,
  bookController.addBook
);
router.put(
  "/:id",
  validateUpdateBook,
  handleValidationErrors,
  bookController.updateBook
);
router.delete("/:id", bookController.deleteBook);
router.put("/bulk/status", bookController.bulkUpdateStatus);
router.get("/export", bookController.exportBooks);

module.exports = router;
