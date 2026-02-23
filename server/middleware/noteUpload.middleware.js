import multer from "multer";
import path from "path";

// STORE IN uploads/notes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/notes");
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});

// ALLOW PDF + DOC + PPT + IMAGE
const fileFilter = (req, file, cb) => {
  const allowed = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "image/png",
    "image/jpeg"
  ];

  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only PDF/DOCX/PPT/Image allowed"), false);
};

const upload = multer({ storage, fileFilter });

export default upload;