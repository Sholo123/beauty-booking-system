import multer from "multer";
import path from "path";

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // folder to save uploaded files
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // keep original extension
    cb(null, Date.now() + ext); // unique filename
  },
});

// Create multer upload instance
export const upload = multer({ storage });
