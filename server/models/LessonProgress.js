import mongoose from "mongoose";

const lessonProgressSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lesson",
    required: true
  },
  completed: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

export default mongoose.model("LessonProgress", lessonProgressSchema);