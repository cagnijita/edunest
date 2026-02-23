import express from "express";
import Lesson from "../models/Lesson.js";
import { lessonUpload } from "../middleware/lessonUpload.middleware.js";
import { protect } from "../middleware/auth.middleware.js";
import Module from "../models/Module.js";
import LessonProgress from "../models/LessonProgress.js";
const router = express.Router();

/* ================= COMPLETE LESSON ================= */
router.post("/complete", protect, async (req, res) => {
  const { lessonId } = req.body;

  const exists = await LessonProgress.findOne({
    studentId: req.user._id,
    lessonId
  });

  if (!exists) {
    await LessonProgress.create({
      studentId: req.user._id,
      lessonId
    });
  }

  res.json({ message: "Lesson marked completed" });
});
/* ================= CREATE LESSON ================= */
router.post("/:courseId", protect, lessonUpload.single("file"), async (req, res) => {
  try {
    const { moduleName, title, type, content } = req.body;

    if (!moduleName || !moduleName.trim())
      return res.status(400).json({ message: "Module name required" });

    /* ---------------- FIND OR CREATE MODULE ---------------- */
    let module = await Module.findOne({
      courseId: req.params.courseId,
      title: moduleName.trim()
    });

    if (!module) {
      module = await Module.create({
        courseId: req.params.courseId,
        title: moduleName.trim()
      });
    }

    /* ---------------- QUIZ PARSE ---------------- */
    let quizData = [];
    if (req.body.quiz) {
      try {
        quizData = JSON.parse(req.body.quiz);
      } catch {
        return res.status(400).json({ message: "Invalid quiz format" });
      }
    }

    /* ---------------- CREATE LESSON ---------------- */
    const lesson = await Lesson.create({
      courseId: req.params.courseId,
      moduleId: module._id,
      title,
      type,
      content: content || "",
      fileUrl: req.file ? `/uploads/lessons/${req.file.filename}` : null,
      quiz: quizData
    });

    res.status(201).json(lesson);

  } catch (err) {
    console.log("LESSON CREATE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});
/* ================= GET LESSONS OF COURSE ================= */
router.get("/course/:courseId", async (req, res) => {
  try {
    const lessons = await Lesson.find({ courseId: req.params.courseId })
      .sort({ createdAt: 1 });

    res.json(lessons);
  } catch (err) {
    console.log("GET LESSON ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});
/* ================= GET SINGLE LESSON ================= */
router.get("/:lessonId", protect, async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.lessonId);
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });

    res.json(lesson);

  } catch (err) {
    console.log("GET LESSON ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});
/* ================= UPDATE LESSON ================= */
router.put("/:lessonId", protect, lessonUpload.single("file"), async (req, res) => {
  try {

    let quizData = null;
    if (req.body.quiz) quizData = JSON.parse(req.body.quiz);

    const updatedLesson = await Lesson.findByIdAndUpdate(
      req.params.lessonId,
      {
        title: req.body.title,
        type: req.body.type,
        content: req.body.content || "",
        fileUrl: req.file ? `/uploads/lessons/${req.file.filename}` : undefined,
       quiz: quizData !== null ? quizData : undefined
      },
      { new: true }
    );

    if (!updatedLesson)
      return res.status(404).json({ message: "Lesson not found" });

    res.json(updatedLesson);

  } catch (err) {
    console.log("LESSON UPDATE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

/* ================= DELETE LESSON ================= */
router.delete("/:lessonId", protect, async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndDelete(req.params.lessonId);

    if (!lesson)
      return res.status(404).json({ message: "Lesson not found" });

    res.json({ message: "Lesson deleted" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



export default router;

