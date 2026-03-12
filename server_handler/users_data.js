import express from "express";
import { MongoClient, ObjectId } from "mongodb";
import { get_s } from "./generate-category_ai.js";
import cors from "cors";
const app = express();
const port = 5000;
import dotenv from "dotenv";
dotenv.config();
app.use(cors());
app.use(express.json());
const client = new MongoClient(process.env.MONGO_URI);
let All_journal;
async function connectDB() {
  await client.connect();
  const db = client.db("User_data");
  All_journal = db.collection("All_journal");
}
connectDB();
app.post("/user_data", async (req, res) => {
  try {
    const { journal, user_id } = req.body;
    let data = await get_s(journal);
    await All_journal.insertOne({user_id,journal,data});
    res.json({success: true,data});
  } catch (err) {
     res.json({ success: false });
  }
});
app.get("/get_data", async (req, res) => {
  try {
  const user_id = req.query.user_id;
    let data = await All_journal.find({ user_id }).toArray();
    res.json({ success: true,data});
  } catch (err) {
    res.json({ success: false });
  }
});
app.post("/delete", async (req, res) => {
  try {
    await All_journal.deleteOne({_id: new ObjectId(req.body.id)});
    res.json({
      success: true
    });
  } catch (err) {
    res.json({ success: false });
  }
});
app.listen(port, () => {
  console.log("Server running on", port);
});