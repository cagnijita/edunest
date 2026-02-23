import mongoose from "mongoose";

const downloadSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    noteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Note",
      required: true
    }
  },
  { timestamps: true }
);

const Download = mongoose.model("Download", downloadSchema);

export default Download;