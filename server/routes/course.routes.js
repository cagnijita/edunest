import express from "express";
import Course from "../models/Course.js";
import Lesson from "../models/Lesson.js";
import { protect , optionalAuth } from "../middleware/auth.middleware.js";
import Enrollment from "../models/Enrollment.js";

import {
  createCourse,
  getAllCourses,
  enrollCourse,
  myCourses,
  teacherCourses,
  updateCourse,
   deleteCourse ,
   previewCourse,
   addModule,
   addLesson
} from "../controllers/course.controller.js";

const router = express.Router();

router.get("/", getAllCourses);
// PUBLIC course preview (no login required)

// CHECK enrollment status for course page
router.get("/enrollment/:courseId", protect, async (req, res) => {
  const enrollment = await Enrollment.findOne({
    studentId: req.user.id,
    courseId: req.params.courseId
  });

  return res.json({
    enrolled: !!enrollment
  });
});

router.post("/complete-lesson", protect, async (req, res) => {
  try {
    const { lessonId, courseId } = req.body;

    const enrollment = await Enrollment.findOne({
      studentId: req.user._id,
      courseId
    });

    if (!enrollment) {
      return res.status(400).json({ message: "Not enrolled" });
    }

    // Avoid duplicate lesson completion
    if (!enrollment.completedLessons.includes(lessonId)) {
      enrollment.completedLessons.push(lessonId);
    }

    // Count total lessons in course
    const totalLessons = await Lesson.countDocuments({ courseId });

    const progress = Math.round(
      (enrollment.completedLessons.length / totalLessons) * 100
    );

    enrollment.progress = progress;

    await enrollment.save();

    res.json({ progress });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get("/my", protect, myCourses);
router.post("/", protect, createCourse);
router.post("/enroll", protect, enrollCourse);
router.get("/teacher/my", protect, teacherCourses);
router.put("/:id", protect, updateCourse);
router.delete("/:id", protect, deleteCourse);
router.get("/preview/:id", protect, previewCourse);
router.post("/:id/modules", protect, addModule);
router.post("/:id/lessons", protect, addLesson);

export default router;
