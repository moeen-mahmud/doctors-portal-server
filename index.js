const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Client
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@doctorsportalcluster.8qkfl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();

    const database = client.db("doctors_portal");
    const appointmentCollection = database.collection("appointments");

    app.get("/appointments", async (req, res) => {
      const cursor = appointmentCollection.find({});
      const result = await cursor.toArray();
      res.json(result);
    });

    app.post("/appointments", async (req, res) => {
      const appointment = req.body;
      const result = await appointmentCollection.insertOne(appointment);
      console.log(result);
      res.json(result);
    });
  } finally {
    // client.close()
  }
}

run().catch(console.dir);

// Server running
app.get("/", (req, res) => {
  res.send("Hello Doctors Portal!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
