const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const corsOptions = require("./config/cors");
const authRoutes = require("./routes/auth.routes");
const queriesRoutes = require("./routes/queries.routes");
const recommendationsRoutes = require("./routes/recommendations.routes");

const app = express();

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Root route
app.get("/", (req, res) => {
  res.send("Qrius Server");
});

// Routes
app.use("/", authRoutes);
app.use("/queries", queriesRoutes);
app.use("/recommendations", recommendationsRoutes);

module.exports = app;
