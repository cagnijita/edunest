import dotenv from "dotenv";
dotenv.config();
import authRoutes from "./routes/auth.routes.js";
import path from "path";
import { fileURLToPath } from "url";
import noteRoutes from "./routes/note.routes.js";
import seedClasses from "./config/seedClasses.js";
import academicRoutes from "./routes/academic.routes.js";
import topicRoutes from "./routes/topic.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import studentRoutes from "./routes/student.routes.js";
import enrollmentRoutes from "./routes/enrollment.routes.js";
import courseRoutes from "./routes/course.routes.js";
import courseRequestRoutes from "./routes/courseRequest.routes.js";
import lessonRoutes from "./routes/lesson.routes.js";
import moduleRoutes from "./routes/module.routes.js";
import aiRoutes from "./routes/ai.routes.js";


import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

const app = express();
const PORT = process.env.PORT || 5000;

// middlewares
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:5173",
  "https://edunest-eight.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow Postman / server calls
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("CORS not allowed"));
  },
  credentials: true
}));

app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/academic", academicRoutes);
app.use("/api/topics", topicRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/course-request", courseRequestRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/modules", moduleRoutes);
app.use("/api/ai", aiRoutes);

// static
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/uploads", express.static("uploads"));
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// START SERVER ONLY AFTER DB CONNECTS
const startServer = async () => {
  try {
    await connectDB();
    await seedClasses();

    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });

  } catch (error) {
    console.error("Server failed to start:", error);
  }
};

startServer();
