import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import Lesson from "../models/Lesson.js";
import Module from "../models/Module.js";

// TEACHER CREATE COURSE
export const createCourse = async (req, res) => {
  try {
    const { title, description, thumbnail, isPaid, price } = req.body;

    const course = await Course.create({
      title,
      description,
      thumbnail,
      teacherId: req.user._id,
      isPaid: isPaid || false,
      price: isPaid ? Number(price) : 0,
      isPublished:true
    });

    res.status(201).json(course);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ALL AVAILABLE COURSES (public)
export const getAllCourses = async (req, res) => {
  const courses = await Course.find()
    .populate("teacherId", "name");

  res.json(courses);
};


// ENROLL COURSE
export const enrollCourse = async (req, res) => {
  const { courseId } = req.body;

  const already = await Enrollment.findOne({
    studentId: req.user._id,
    courseId
  });

  if (already) return res.status(400).json({ message: "Already enrolled" });

  const enroll = await Enrollment.create({
    studentId: req.user._id,
    courseId
  });

  res.json(enroll);
};


// MY COURSES
export const myCourses = async (req, res) => {
  const courses = await Enrollment.find({ studentId: req.user._id })
    .populate({
      path: "courseId",
      populate: { path: "teacherId", select: "name" }
    });

  res.json(courses);
};

// UPDATE COURSE (Teacher only)
export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // security: only creator teacher can edit
   if (!course.teacherId.equals(req.user._id))
      return res.status(403).json({ message: "Not allowed to edit this course" });

    const { title, description, thumbnail, isPublished, isPaid, price} = req.body;

    if (title !== undefined) course.title = title;
    if (description !== undefined) course.description = description;
    if (thumbnail !== undefined) course.thumbnail = thumbnail;
    if (isPublished !== undefined) course.isPublished = isPublished;

    await course.save();

    res.json({ message: "Course updated successfully", course });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// TEACHER COURSES
export const teacherCourses = async (req, res) => {
  try {
    const courses = await Course.find({
      teacherId: req.user._id
    });

    res.json(courses);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE COURSE (teacher only)
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course)
      return res.status(404).json({ message: "Course not found" });

    if (course.teacherId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await course.deleteOne();
    res.json({ message: "Course deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




export const previewCourse = async (req, res) => {
 console.log("REQ USER:", req.user);
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // check access
    let isAllowed = false;

    if (req.user) {
      if (course.teacherId.toString() === req.user._id.toString()) {
        isAllowed = true;
      } else {
        const enrolled = await Enrollment.findOne({
          studentId: req.user._id,
          courseId: course._id
        });
        if (enrolled) isAllowed = true;
      }
    }

    // 🔴 REAL MODULES
    const modules = await Module.find({ courseId: course._id })
      .sort({ createdAt: 1 })
      .lean();

    // attach lessons to correct module
    for (const module of modules) {
      if (isAllowed) {
        module.lessons = await Lesson.find({ moduleId: module._id }).sort({ createdAt: 1 });
      } else {
        module.lessons = [];
      }
    }
// 🔥 Calculate progress for student
let progress = 0;

if (req.user && isAllowed) {
  const enrollment = await Enrollment.findOne({
    studentId: req.user._id,
    courseId: course._id
  });

  if (enrollment) {
    progress = enrollment.progress || 0;
  }
}
    res.json({
  ...course.toObject(),
  modules,
  isEnrolled: isAllowed,
  progress
});

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addModule = async (req, res) => {
  try {
    const { title } = req.body;
    const courseId = req.params.id;

    if (!title) {
      return res.status(400).json({ message: "Title required" });
    }

    const module = await Module.create({
      title,
      courseId
    });

    res.status(201).json(module);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



export const addLesson = async (req, res) => {
  try {
    const { moduleId, title } = req.body;
    const courseId = req.params.id;   // IMPORTANT

    if (!moduleId || !title) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const module = await Module.findById(moduleId);
    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }

    const lesson = await Lesson.create({
      courseId,
      moduleId,
      title,
      type: "video",
      content: "https://youtu.be/test"  // temporary default
    });

    res.status(201).json(lesson);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};