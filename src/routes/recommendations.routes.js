const express = require("express");
const { verifyToken } = require("../middlewares/auth");
const {
  getAllRecommendations,
  getRecommendationsForQuestioner,
  getRecommendationsByRecommender,
  getRecommendationsByQueryId,
  createRecommendation,
  deleteRecommendation,
} = require("../controllers/recommendations.controller");

const router = express.Router();

// Get all recommendations
router.get("/", getAllRecommendations);

// Get recommendations for questioner (protected)
router.get("/questioner/filter", verifyToken, getRecommendationsForQuestioner);

// Get recommendations by recommender (protected)
router.get("/recommender/filter", verifyToken, getRecommendationsByRecommender);

// Get recommendations by query ID
router.get("/:id", getRecommendationsByQueryId);

// Create new recommendation
router.post("/", createRecommendation);

// Delete recommendation
router.delete("/delete/:id", deleteRecommendation);

module.exports = router;
