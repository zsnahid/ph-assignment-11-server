require("dotenv").config();
const express = require("express");
const cors = require("cors");
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

app.use(cors());
app.use(express.json());

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

    app.get("/queries", async (req, res) => {
      const result = await queries.find().toArray();
      res.send(result);
    });

    app.get("/recommendations", async (req, res) => {
      const result = await recommendations.find().toArray();
      res.send(result);
    });

    app.get("/queries/:id", async (req, res) => {
      const id = req.params.id;
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

    app.patch("/queries/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = { $inc: { recommendationCount: +1 } };
      const result = await queries.updateOne(filter, updatedDoc);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);
