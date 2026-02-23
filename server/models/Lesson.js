import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema(
{
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true
  },

  moduleId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Module",
  required: true
},

  title: {
    type: String,
    required: true
  },

  type: {
    type: String,
    enum: ["video", "note", "quiz"],
    required: true
  },

  // VIDEO URL
  content: String,

  // NOTE FILE
  fileUrl: String,

  duration: String,

  // QUIZ
 quiz: [
  {
    question: String,
    type: {
      type: String,
      enum: ["single", "multiple", "text"],
      default: "single"
    },
    options: [String],
    correctAnswers: [String] // supports checkbox & radio
  }
],
duration: {
  type: Number, // seconds
  default: 1800 // fallback 10 minutes
}
},
{ timestamps: true }
);


// 🔒 VALIDATION: enforce content based on lesson type
lessonSchema.pre("save", async function () {

  if (this.type === "video") {
    if (!this.content || this.content.trim() === "")
      throw new Error("Video lesson requires URL");
  }

  if (this.type === "note") {
    if (!this.fileUrl && !this.content)
      throw new Error("Note requires text or file");
  }

  if (this.type === "quiz" && (!Array.isArray(this.quiz) || this.quiz.length === 0))
  return next(new Error("Quiz lesson requires at least one question"));

});

export default mongoose.model("Lesson", lessonSchema);