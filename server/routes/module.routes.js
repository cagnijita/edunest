import express from "express";
import Module from "../models/Module.js";
import { protect } from "../middleware/auth.middleware.js";
import Lesson from "../models/Lesson.js";

const router = express.Router();

/* CREATE MODULE */
export const createModule = async (req, res) => {
  try {
    const module = await Module.create({
      title: req.body.title,
      courseId: req.params.courseId
    });

    res.json(module);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* GET COURSE MODULES */
router.get("/:courseId", async (req,res)=>{
  const modules = await Module.find({courseId:req.params.courseId})
                              .sort({order:1});
  res.json(modules);
});

/* DELETE MODULE */
/* ================= DELETE MODULE ================= */
router.delete("/:moduleId", protect, async (req, res) => {
  try {
    const module = await Module.findById(req.params.moduleId);
    if (!module) return res.status(404).json({ message: "Module not found" });

    // remove all lessons inside module
    await Lesson.deleteMany({ moduleId: module._id });

    await module.deleteOne();

    res.json({ message: "Module and its lessons deleted" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// update module 
export const updateModule = async (req, res) => {
  try {
    const module = await Module.findByIdAndUpdate(
      req.params.moduleId,
      { title: req.body.title },
      { new: true }
    );

    res.json(module);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

router.put("/:moduleId", protect, async (req, res) => {
  try {
    const module = await Module.findByIdAndUpdate(
      req.params.moduleId,
      { title: req.body.title },
      { new: true }
    );

    if (!module) return res.status(404).json({ message: "Module not found" });

    res.json(module);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
export default router;