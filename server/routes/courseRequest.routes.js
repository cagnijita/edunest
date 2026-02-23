import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import CourseRequest from "../models/CourseRequest.js";

const router = express.Router();

// student submits request
router.post("/", protect, async (req, res) => {
  try {
    const { courseId, name, email, phone, message } = req.body;

    const request = await CourseRequest.create({
      studentId: req.user.id,
      courseId,
      name,
      email,
      phone,
      message
    });

    res.json({ message: "Request sent successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
