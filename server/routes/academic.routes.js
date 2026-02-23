import express from "express";
import ClassModel from "../models/Class.js";
import Topic from "../models/Topic.js";

const router = express.Router();

// get all classes
router.get("/classes", async (req, res) => {
  const classes = await ClassModel.find();
  res.json(classes);
});

// get topics by class
router.get("/topics/:classId", async (req, res) => {
  const topics = await Topic.find({ classId: req.params.classId });
  res.json(topics);
});

export default router;
