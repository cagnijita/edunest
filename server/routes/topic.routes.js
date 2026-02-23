import express from "express";
import Topic from "../models/Topic.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();


// GET topics of a class
router.get("/:classId", protect, async (req, res) => {
  try {
    const topics = await Topic.find({ classId: req.params.classId });
    res.json(topics);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// CREATE topic
router.post("/", protect, async (req, res) => {
  try {
    const { name, classId } = req.body;

    const exists = await Topic.findOne({ name, classId });
    if (exists)
      return res.status(400).json({ message: "Topic already exists" });

    const topic = await Topic.create({ name, classId });

    res.status(201).json(topic);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
