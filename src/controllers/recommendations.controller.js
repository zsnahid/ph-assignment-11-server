const { ObjectId } = require("mongodb");

let recommendationsCollection;

// Initialize collection
const initRecommendationsCollection = (db) => {
  recommendationsCollection = db.collection("recommendations");
};

// Get all recommendations
const getAllRecommendations = async (req, res) => {
  try {
    const result = await recommendationsCollection.find().toArray();
    res.send(result);
  } catch (error) {
    res
      .status(500)
      .send({
        message: "Error fetching recommendations",
        error: error.message,
      });
  }
};

// Get recommendations for questioner
const getRecommendationsForQuestioner = async (req, res) => {
  try {
    const email = req.query.email;

    if (req.user.email !== email) {
      return res.status(403).send({ message: "forbidden access" });
    }

    const query = { questionerEmail: email };
    const result = await recommendationsCollection.find(query).toArray();
    res.send(result);
  } catch (error) {
    res
      .status(500)
      .send({
        message: "Error fetching questioner recommendations",
        error: error.message,
      });
  }
};

// Get recommendations by recommender
const getRecommendationsByRecommender = async (req, res) => {
  try {
    const email = req.query.email;

    if (req.user.email !== email) {
      return res.status(403).send({ message: "forbidden access" });
    }

    const query = { recommenderEmail: email };
    const result = await recommendationsCollection.find(query).toArray();
    res.send(result);
  } catch (error) {
    res
      .status(500)
      .send({
        message: "Error fetching recommender recommendations",
        error: error.message,
      });
  }
};

// Get recommendations by query ID
const getRecommendationsByQueryId = async (req, res) => {
  try {
    const id = req.params.id;
    const query = { queryId: id };
    const result = await recommendationsCollection
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();
    res.send(result);
  } catch (error) {
    res
      .status(500)
      .send({
        message: "Error fetching recommendations by query",
        error: error.message,
      });
  }
};

// Create new recommendation
const createRecommendation = async (req, res) => {
  try {
    const newRecommendation = { ...req.body, createdAt: new Date() };
    const result = await recommendationsCollection.insertOne(newRecommendation);
    res.status(201).send(result);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error creating recommendation", error: error.message });
  }
};

// Delete recommendation
const deleteRecommendation = async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const result = await recommendationsCollection.deleteOne(query);
    res.send(result);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error deleting recommendation", error: error.message });
  }
};

module.exports = {
  initRecommendationsCollection,
  getAllRecommendations,
  getRecommendationsForQuestioner,
  getRecommendationsByRecommender,
  getRecommendationsByQueryId,
  createRecommendation,
  deleteRecommendation,
};
