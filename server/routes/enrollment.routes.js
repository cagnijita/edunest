import express from "express";
import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";
import { protect } from "../middleware/auth.middleware.js";
import Payment from "../models/Payment.js";

const router = express.Router();


// ===============================
// ENROLL IN COURSE
// ===============================
router.post("/:courseId", protect, async (req, res) => {
  try {
    const studentId = req.user.id;
    const { courseId } = req.params;

    // prevent teacher/admin enrolling
if (req.user.role !== "student")
  return res.status(403).json({ message: "Only students can enroll" });

const course = await Course.findById(courseId);
    if (!course)
      return res.status(404).json({ message: "Course not found" });
    // 🔐 If paid, verify payment exists
    if (course.price > 0) {
      const payment = await Payment.findOne({
        studentId,
        courseId,
        status: "success"
      });

      if (!payment) {
        return res.status(403).json({
          message: "Payment required before enrollment"
        });
      }
    }
// check exists
const exists = await Enrollment.findOne({ studentId, courseId });
if (exists)
  return res.status(400).json({ message: "You already applied for this course" });

// save form details also
const enrollment = await Enrollment.create({
  studentId,
  courseId,
  name: req.body.name,
  email: req.body.email,
  age: req.body.age,
  studentClass: req.body.studentClass,
  phone: req.body.phone,
  amount: req.body.amount,
  status: "enrolled" //
});

res.json({ message: "Enrollment request sent", enrollment });

} catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// ===============================
// GET MY COURSES
// ===============================
router.get("/my", protect, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ studentId: req.user.id })
      .populate("courseId");

    const courses = enrollments.map(e => e.courseId);

    res.json(courses);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/payments/simulate", protect, async (req, res) => {
  try {
    const { courseId } = req.body;
    const studentId = req.user.id;

    const course = await Course.findById(courseId);
    if (!course)
      return res.status(404).json({ message: "Course not found" });

    await Payment.findOneAndUpdate(
      { studentId, courseId },
      {
        studentId,
        courseId,
        amount: course.price,
        transactionId: "SIMULATED_TXN",
        status: "success"
      },
      { upsert: true }
    );

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ message: "Simulation failed" });
  }
});
export default router;
