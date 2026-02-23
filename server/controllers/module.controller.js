import Module from "../models/Module.js";

// CREATE MODULE
export const createModule = async (req, res) => {
  try {
    console.log("CREATE MODULE HIT", req.params, req.body);
    const { title } = req.body;
    const { courseId } = req.params;

    const module = await Module.create({
      title,
      courseId
    });

    res.status(201).json(module);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET MODULES OF A COURSE
export const getModulesByCourse = async (req, res) => {
  try {
    const modules = await Module.find({
      courseId: req.params.courseId
    }).sort({ order: 1 });

    res.json(modules);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

