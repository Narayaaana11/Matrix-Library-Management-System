const express = require("express");
const router = express.Router();
const { login, getMe, logout, refreshToken } = require("../controllers/authController");
const authMiddleware = require("../middleware/auth");
const { validateLogin, handleValidationErrors } = require("../middleware/validation");
const { authLimiter } = require("../middleware/rateLimiter");

router.post("/login", authLimiter, validateLogin, handleValidationErrors, login);
router.post("/logout", authMiddleware, logout);
router.post("/refresh-token", refreshToken);
router.get("/me", authMiddleware, getMe);

module.exports = router;
