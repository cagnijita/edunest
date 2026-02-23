import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true
  },

  // --- NEW FORM DATA ---
  name: String,
  email: String,
  age: String,
  studentClass: String,
  phone: String,
  amount: String,

  // teacher approval system
  status: {
    type: String,
    default: "enrolled"
  },

completedLessons: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lesson"
  }
],
progress: { type: Number, default: 0 }

}, { timestamps: true });

export default mongoose.model("Enrollment", enrollmentSchema);