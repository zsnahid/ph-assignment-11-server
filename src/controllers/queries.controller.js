const { ObjectId } = require("mongodb");

let queriesCollection;

// Initialize collection
const initQueriesCollection = (db) => {
  queriesCollection = db.collection("queries");
};

// Get all queries
const getAllQueries = async (req, res) => {
  try {
    const result = await queriesCollection.find().toArray();
    res.send(result);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error fetching queries", error: error.message });
  }
};

// Get latest 6 queries
const getLatestQueries = async (req, res) => {
  try {
    const result = await queriesCollection
      .find()
      .sort({ _id: -1 })
      .limit(6)
      .toArray();
    res.send(result);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error fetching latest queries", error: error.message });
  }
};

// Get queries by user email (filtered)
const getQueriesByUser = async (req, res) => {
  try {
    const email = req.query.email;

    if (req.user.email !== email) {
      return res.status(403).send({ message: "forbidden" });
    }

    const query = { userEmail: email };
    const result = await queriesCollection.find(query).toArray();
    res.send(result);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error fetching user queries", error: error.message });
  }
};

// Search queries by product name or question
const searchQueries = async (req, res) => {
  try {
    const product = req.query.product;
    const regex = new RegExp(product, "i");
    const query = {
      $or: [{ question: regex }, { productName: regex }],
    };
    const result = await queriesCollection.find(query).toArray();
    res.send(result);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error searching queries", error: error.message });
  }
};

// Get query by ID
const getQueryById = async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await queriesCollection.findOne(query);
    res.send(result);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error fetching query", error: error.message });
  }
};

// Create new query
const createQuery = async (req, res) => {
  try {
    const query = req.body;
    const result = await queriesCollection.insertOne(query);
    res.send(result);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error creating query", error: error.message });
  }
};

// Update query
const updateQuery = async (req, res) => {
  try {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const updatedDoc = { $set: req.body };
    const result = await queriesCollection.updateOne(filter, updatedDoc);
    res.send(result);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error updating query", error: error.message });
  }
};

// Increment recommendation count
const incrementRecommendationCount = async (req, res) => {
  try {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const updatedDoc = { $inc: { recommendationCount: +1 } };
    const result = await queriesCollection.updateOne(filter, updatedDoc);
    res.send(result);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error incrementing count", error: error.message });
  }
};

// Decrement recommendation count
const decrementRecommendationCount = async (req, res) => {
  try {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const updatedDoc = { $inc: { recommendationCount: -1 } };
    const result = await queriesCollection.updateOne(filter, updatedDoc);
    res.send(result);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error decrementing count", error: error.message });
  }
};

// Delete query
const deleteQuery = async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const result = await queriesCollection.deleteOne(query);
    res.send(result);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error deleting query", error: error.message });
  }
};

module.exports = {
  initQueriesCollection,
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
};
