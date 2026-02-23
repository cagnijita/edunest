import Enrollment from "../models/Enrollment.js";

export const createEnrollment = async (req, res) => {
  try {
    const exists = await Enrollment.findOne({
      courseId: req.params.courseId,
      studentId: req.user.id
    });

    if (exists) {
      return res.status(400).json({ message: "You already applied for this course" });
    }

    const enrollment = await Enrollment.create({
      courseId: req.params.courseId,
      studentId: req.user.id,
      ...req.body
    });

    res.status(201).json({ message: "Enrollment request sent", enrollment });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};