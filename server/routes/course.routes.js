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

    console.log("LessonId:", lessonId);
    console.log("CourseId:", courseId);
    console.log("Student:", req.user._id);

    const enrollment = await Enrollment.findOne({
      studentId: req.user._id,
      courseId: courseId
    });

    if (!enrollment) {
      console.log("Enrollment NOT FOUND");
      return res.status(404).json({ message: "Enrollment not found" });
    }

    console.log("Before:", enrollment.completedLessons);

    // FIX ObjectId comparison
    const exists = enrollment.completedLessons.some(
      id => id.toString() === lessonId
    );

    if (!exists) {
      enrollment.completedLessons.push(lessonId);
      await enrollment.save();
      console.log("Saved successfully");
    }

    console.log("After:", enrollment.completedLessons);

   // calculate progress
const totalLessons = await Lesson.countDocuments({
  courseId: courseId
});

const completedCount = enrollment.completedLessons.length;

const progress =
  totalLessons > 0
    ? Math.round((completedCount / totalLessons) * 100)
    : 0;

res.json({
  success: true,
  progress,
  completedLessons: completedCount
});
  } catch (err) {
    console.error(err);
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
