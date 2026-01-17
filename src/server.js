require("dotenv").config();
const app = require("./app");
const { connectDB } = require("./config/db");
const { initQueriesCollection } = require("./controllers/queries.controller");
const {
  initRecommendationsCollection,
} = require("./controllers/recommendations.controller");

const port = process.env.PORT || 3000;

async function startServer() {
  try {
    // Connect to database and initialize collections
    const db = await connectDB();
    initQueriesCollection(db);
    initRecommendationsCollection(db);

    // Start server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();

module.exports = app;
