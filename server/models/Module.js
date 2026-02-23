import mongoose from "mongoose";

const moduleSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true
  },
  title: {
    type: String,
    required: true
  },
  order: Number
}, { timestamps: true });

export default mongoose.model("Module", moduleSchema);