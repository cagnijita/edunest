import express from "express";
import Note from "../models/Note.js";
import { protect } from "../middleware/auth.middleware.js";
import mongoose from "mongoose";
import Download from "../models/Download.js";
import Lesson from "../models/Lesson.js";
import LessonProgress from "../models/LessonProgress.js";
const router = express.Router();

router.get("/dashboard", protect, async (req, res) => {
  try {

    const notes = await Note.find()
      .populate({
        path: "topicId",
        populate: { path: "classId" }
      });

    const classNotes = notes.filter(n =>
      n.topicId &&
      n.topicId.classId &&
      n.topicId.classId._id.toString() === req.user.classId.toString()
    );

    if (classNotes.length === 0) {
      return res.json({
        courseName: null,
        totalModules: 0,
        completed: 0,
        progress: 0
      });
    }

    const courseName = classNotes[0].topicId.name;
    const totalModules = classNotes.length;

    // count real downloads for this student
const downloadCount = await Download.countDocuments({
  studentId: req.user._id,
  noteId: { $in: classNotes.map(n => n._id) }
});

const completed = downloadCount;

const progress =
  totalModules === 0
    ? 0
    : Math.floor((downloadCount / totalModules) * 100);

    res.json({
      courseName,
      totalModules,
      completed,
      progress
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
