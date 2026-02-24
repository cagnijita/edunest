import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";
import Payment from "../models/Payment.js"; 

export const createEnrollment = async (req, res) => {
  try {

    const courseId = req.params.courseId;
    const studentId = req.user.id;

    // 🔎 Check course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // 🔐 PAYMENT CHECK (VERY IMPORTANT)
    if (course.price > 0) {
      const payment = await Payment.findOne({
        courseId,
        studentId,
        status: "success"
      });

      if (!payment) {
        return res.status(403).json({
          message: "Payment required before enrollment"
        });
      }
    }

    // 🔁 Duplicate check
    const exists = await Enrollment.findOne({
      courseId,
      studentId
    });

    if (exists) {
      return res.status(400).json({
        message: "You are already enrolled in this course"
      });
    }

    // ✅ Create enrollment
    const enrollment = await Enrollment.create({
      courseId,
      studentId,
      ...req.body
    });

    res.status(201).json({
      message: "Enrollment successful",
      enrollment
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};