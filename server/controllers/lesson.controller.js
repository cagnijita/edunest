import Lesson from "../models/Lesson.js";
import Module from "../models/Module.js";

export const createLesson = async (req, res) => {
  try {
    const { moduleName, title, type, content } = req.body;

    // 🔹 find module using name + course
    const module = await Module.findOne({
      title: moduleName,
      courseId: req.params.courseId
    });

    if (!module)
      return res.status(404).json({ message: "Module not found" });

    let lessonData = {
      courseId: req.params.courseId,
      moduleId: module._id,   // ⭐ THE IMPORTANT LINE
      title,
      type
    };

    // VIDEO or QUIZ
    if (type === "video" || type === "quiz") {
      if (!content) return res.status(400).json({ message: "Content required" });
      lessonData.content = content;
    }

    // NOTE → file upload
    if (type === "note") {
      if (!req.file)
        return res.status(400).json({ message: "File required for note" });

      lessonData.fileUrl = `/uploads/lessons/${req.file.filename}`;
    }

    const lesson = await Lesson.create(lessonData);
    res.status(201).json(lesson);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

