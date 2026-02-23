import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import Enrollment from "../models/Enrollment.js";
import Note from "../models/Note.js";
import { generateSummary } from "../services/geminiService.js";

const router = express.Router();

router.post("/summarize", protect, async (req, res) => {
  try {
    const { id: userId, role } = req.user;
    const { noteId } = req.body;

    if (!noteId) {
      return res.status(400).json({ message: "Note ID is required" });
    }

    const note = await Note.findById(noteId).populate("courseId");

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Teacher & Admin allowed directly
    if (role === "teacher" || role === "admin") {
      const summary = await generateSummary(note.title);
      return res.status(200).json({ summary });
    }

    // Student must be enrolled
    const enrolled = await Enrollment.findOne({
      userId,
      courseId: note.courseId._id,
    });

    if (!enrolled) {
      return res.status(403).json({
        message: "You are not enrolled in this course",
      });
    }

    const summary = await generateSummary(note.title);

    return res.status(200).json({ summary });

  } catch (error) {
    console.error("AI Summary Error:", error);
    return res.status(500).json({
      message: "Failed to generate AI summary",
    });
  }
});

router.post("/study-plan", protect, async (req, res) => {
  try {
    const { id: userId, role } = req.user;
    const { subjects } = req.body;

    if (!subjects || !subjects.length) {
      return res.status(400).json({ message: "Subjects required" });
    }

    // If student → must be enrolled in at least one course
    if (role === "student") {
      const enrolled = await Enrollment.findOne({ studentId: userId });
      if (!enrolled) {
        return res.status(403).json({
          message: "You are not enrolled in any course"
        });
      }
    }

    const prompt = `
    Create a structured 4-week study plan for the following subjects:
    ${subjects.join(", ")}.

    Divide by weeks.
    Mention daily focus.
    Keep it practical and realistic.
    `;

    const plan = await generateSummary(prompt); 
    // reuse Gemini function

    res.status(200).json({ plan });

  } catch (error) {
    console.error("AI Study Plan Error:", error);
    res.status(500).json({ message: "Failed to generate study plan" });
  }
});

export default router;