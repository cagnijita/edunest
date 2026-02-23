import Topic from "../models/Topic.js";

// CREATE TOPIC
export const createTopic = async (req, res) => {
  try {
    const { name, classId } = req.body;

    const topic = await Topic.create({ name, classId });

    res.status(201).json(topic);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET TOPICS BY CLASS
export const getTopicsByClass = async (req, res) => {
  try {
    const topics = await Topic.find({ classId: req.params.classId });
    res.json(topics);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
