import Note from "../models/Note.js";
import Download from "../models/Download.js";

// CREATE NOTE
export const createNote = async (req, res) => {
  try {
    const { title, topicId } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "File required" });
    }

    const note = await Note.create({
  title: req.body.title,
  topicId: req.body.topicId,
  fileUrl: `/uploads/notes/${req.file.filename}`,
  fileType: req.file.mimetype,
  uploadedBy: req.user._id    // 
});

    res.status(201).json(note);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// GET ALL NOTES

export const getNotes = async (req, res) => {
  try {

    // If teacher → show their uploaded notes
    if (req.user.role === "teacher") {
      const notes = await Note.find({ uploadedBy: req.user._id })
        .populate({
          path: "topicId",
          populate: { path: "classId" }
        })
        .sort({ createdAt: -1 });

      return res.json(notes);
    }

    // If student → show notes of their class
    if (req.user.role === "student") {
      const notes = await Note.find()
        .populate({
          path: "topicId",
          populate: { path: "classId" }
        });

      const classNotes = notes.filter(n =>
        n.topicId &&
        n.topicId.classId &&
        n.topicId.classId._id.toString() === req.user.classId.toString()
      );

      return res.json(classNotes);
    }

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// DELETE NOTE
export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) return res.status(404).json({ message: "Note not found" });

    // only teacher who uploaded OR admin can delete
    if (
      note.uploadedBy.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await note.deleteOne();

    res.json({ message: "Note deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE NOTE
export const updateNote = async (req, res) => {
  try {
    const { title, topicId } = req.body;

    const note = await Note.findById(req.params.id);

    if (!note) return res.status(404).json({ message: "Note not found" });

    // Only owner can edit
    if (note.uploadedBy.toString() !== req.user.id.toString())
      return res.status(403).json({ message: "Not allowed" });

    note.title = title || note.title;
    note.topicId = topicId || note.topicId;

    await note.save();

    res.json({ message: "Note updated", note });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const downloadNote = async (req, res) => {
  try {
    const { noteId } = req.params;

    const already = await Download.findOne({
      studentId: req.user._id,
      noteId
    });

    if (!already) {
      await Download.create({
        studentId: req.user._id,
        noteId
      });
    }

    const note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json({ fileUrl: note.fileUrl });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};