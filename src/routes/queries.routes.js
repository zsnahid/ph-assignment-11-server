const express = require("express");
const { verifyToken } = require("../middlewares/auth");
const {
  getAllQueries,
  getLatestQueries,
  getQueriesByUser,
  searchQueries,
  getQueryById,
  createQuery,
  updateQuery,
  incrementRecommendationCount,
  decrementRecommendationCount,
  deleteQuery,
} = require("../controllers/queries.controller");

const router = express.Router();

// Get all queries
router.get("/", getAllQueries);

// Get latest 6 queries
router.get("/latest", getLatestQueries);

// Get user-specific queries (protected)
router.get("/filter", verifyToken, getQueriesByUser);

// Search queries
router.get("/search", searchQueries);

// Get single query by ID
router.get("/:id", getQueryById);

// Create new query
router.post("/", createQuery);

// Update query
router.patch("/update/:id", updateQuery);

// Increment recommendation count
router.patch("/increment/:id", incrementRecommendationCount);

// Decrement recommendation count
router.patch("/decrement/:id", decrementRecommendationCount);

// Delete query
router.delete("/:id", deleteQuery);

module.exports = router;
