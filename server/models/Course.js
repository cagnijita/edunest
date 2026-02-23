import mongoose from "mongoose";
import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import Lesson from "../models/Lesson.js";

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  thumbnail: String,
isPaid: { type: Boolean, default: false },
price: { type: Number, default: 0 },

  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  isPublished: { type: Boolean, default: false }

}, { timestamps: true });

export default mongoose.model("Course", courseSchema);
