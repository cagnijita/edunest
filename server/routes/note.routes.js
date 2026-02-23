import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { createNote, getNotes, updateNote, deleteNote, downloadNote } from "../controllers/note.controller.js";
import upload from "../middleware/noteUpload.middleware.js"; // 

const router = express.Router();

router.post("/", protect, upload.single("file"), createNote); // 
router.get("/", protect, getNotes);
router.put("/:id", protect, updateNote);
router.delete("/:id", protect, deleteNote);
router.get("/download/:noteId", protect, downloadNote);
export default router;
