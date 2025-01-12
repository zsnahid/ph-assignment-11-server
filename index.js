require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const port = process.env.port || 3000;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.h1aou.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    app.get("/queries", (req, res) => {
      const cursor = queries.find().toArray();
      res.send(cursor);
    });

    app.post("/queries", async (req, res) => {
      const query = req.body;
      const result = await queries.insertOne(query);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);
