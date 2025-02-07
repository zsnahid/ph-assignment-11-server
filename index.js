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
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => res.send("Better Buy Server"));

app.listen(port, () => console.log(`Server running on port ${port}`));

async function run() {
  try {
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    const database = client.db("assignment11db");
    const queries = database.collection("queries");
    const recommendations = database.collection("recommendations");

    //access related APIs
    app.post("/jwt", (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "5h",
      });
      console.log("token created");
      res
        .cookie("token", token, {
          httpOnly: true,
          secure: false,
        })
        .send({ success: true });
    });

    app.get("/queries", async (req, res) => {
      const result = await queries.find().toArray();
      res.send(result);
    });

    app.get("/queries/filter", async (req, res) => {
      const email = req.query.email;
      const query = { userEmail: email };
      const result = await queries.find(query).toArray();
      res.send(result);
    });

    app.get("/queries/search", async (req, res) => {
      const product = req.query.product;
      const regex = new RegExp(product, "i");
      const query = { productName: regex };
      const result = await queries.find(query).toArray();
      res.send(result);
    });

    app.get("/recommendations", async (req, res) => {
      const result = await recommendations.find().toArray();
      res.send(result);
    });

    app.get("/recommendations/questioner/filter", async (req, res) => {
      const email = req.query.email;
      const query = { questionerEmail: email };
      const result = await recommendations.find(query).toArray();
      res.send(result);
    });

    app.get("/recommendations/recommender/filter", async (req, res) => {
      const email = req.query.email;
      const query = { recommenderEmail: email };
      const result = await recommendations.find(query).toArray();
      res.send(result);
    });

    app.get("/queries/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await queries.findOne(query);
      res.send(result);
    });

    app.get("/recommendations/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(typeof id, id);
      const query = { queryId: id };
      const result = await recommendations.find(query).toArray();
      res.send(result);
    });

    app.post("/queries", async (req, res) => {
      const query = req.body;
      // console.log(query);
      const result = await queries.insertOne(query);
      res.send(result);
    });

    app.post("/recommendations", async (req, res) => {
      const recommendation = req.body;
      // console.log(recommendation);
      const result = await recommendations.insertOne(recommendation);
      res.send(result);
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
