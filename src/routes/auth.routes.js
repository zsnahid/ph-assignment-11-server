const express = require("express");
const { generateToken, logout } = require("../controllers/auth.controller");

const router = express.Router();

// JWT generation endpoint
router.post("/jwt", generateToken);

// Logout endpoint
router.post("/logout", logout);

module.exports = router;
