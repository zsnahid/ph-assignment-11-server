require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.port || 3000;
const uri = `mongodb+srv://${process.env.DB_ADMIN}:${process.env.DB_PASSWORD}@cluster0.h1aou.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://ph-assignment-11-94a71.web.app",
      "https://ph-assignment-11-94a71.firebaseapp.com",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const verifyToken = (req, res, next) => {
  const token = req.cookies?.token;
  // console.log("token inside verifyToken", token);
  if (!token) {
    return res.status(401).send({ message: "unauthorized access" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      res.status(401).send({ message: "unauthorized access" });
    }
    req.user = decoded;
    next();
  });
};

app.get("/", (req, res) => res.send("Qrius Server"));

app.listen(port);

async function run() {
  try {
    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );

    const database = client.db("assignment11db");
    const queries = database.collection("queries");
    const recommendations = database.collection("recommendations");

    //access related APIs
    app.post("/jwt", (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "5h",
      });
      res
        .cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        })
        .send({ success: true });
    });

    //clear cookie
    app.post("/logout", (req, res) => {
      res
        .clearCookie("token", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        })
        .send({ success: true });
    });

    app.get("/queries", async (req, res) => {
      const result = await queries.find().toArray();
      res.send(result);
    });

    app.get("/queries/latest", async (req, res) => {
      const result = await queries.find().sort({ _id: -1 }).limit(6).toArray();
      res.send(result);
    });

    app.get("/queries/filter", verifyToken, async (req, res) => {
      const email = req.query.email;

      if (req.user.email !== email) {
        return res.status(403).send({ message: "forbidden" });
      }

      const query = { userEmail: email };
      const result = await queries.find(query).toArray();
      res.send(result);
    });

    app.get("/queries/search", async (req, res) => {
      const product = req.query.product;
      const regex = new RegExp(product, "i");
      // const query = { productName: regex };
      const query = {
        $or: [{ question: regex }, { productName: regex }],
      };
      const result = await queries.find(query).toArray();
      res.send(result);
    });

    app.get("/recommendations", async (req, res) => {
      const result = await recommendations.find().toArray();
      res.send(result);
    });

    app.get(
      "/recommendations/questioner/filter",
      verifyToken,
      async (req, res) => {
        const email = req.query.email;

        if (req.user.email !== email) {
          return res.status(403).send({ message: "forbidden access" });
        }

        const query = { questionerEmail: email };
        const result = await recommendations.find(query).toArray();
        res.send(result);
      }
    );

    app.get(
      "/recommendations/recommender/filter",
      verifyToken,
      async (req, res) => {
        const email = req.query.email;

        if (req.user.email !== email) {
          return res.status(403).send({ message: "forbidden access" });
        }

        const query = { recommenderEmail: email };
        const result = await recommendations.find(query).toArray();
        res.send(result);
      }
    );

    app.get("/queries/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await queries.findOne(query);
      res.send(result);
    });

    app.get("/recommendations/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(typeof id, id);
      const query = { queryId: id };
      const result = await recommendations
        .find(query)
        .sort({ createdAt: -1 })
        .toArray();
      res.send(result);
    });

    app.post("/queries", async (req, res) => {
      const query = req.body;
      // console.log(query);
      const result = await queries.insertOne(query);
      res.send(result);
    });

    app.post("/recommendations", async (req, res) => {
      const newRecommendation = { ...req.body, createdAt: new Date() };

      const result = await recommendations.insertOne(newRecommendation);

      res.status(201).send(result);
    });

    app.patch("/queries/update/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = { $set: req.body };
      const result = await queries.updateOne(filter, updatedDoc);
      res.send(result);
    });

    app.patch("/queries/increment/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = { $inc: { recommendationCount: +1 } };
      const result = await queries.updateOne(filter, updatedDoc);
      res.send(result);
    });

    app.patch("/queries/decrement/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = { $inc: { recommendationCount: -1 } };
      const result = await queries.updateOne(filter, updatedDoc);
      res.send(result);
    });

    app.delete("/queries/:id", async (req, res) => {
      const query = { _id: new ObjectId(req.params.id) };
      const result = await queries.deleteOne(query);
      res.send(result);
    });

    app.delete("/recommendations/delete/:id", async (req, res) => {
      const query = { _id: new ObjectId(req.params.id) };
      const result = await recommendations.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);
