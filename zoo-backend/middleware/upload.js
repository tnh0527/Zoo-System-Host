import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directories exist
const animalsDir = path.join(__dirname, "..", "uploads", "animals");
const exhibitsDir = path.join(__dirname, "..", "uploads", "exhibits");

if (!fs.existsSync(animalsDir)) {
  fs.mkdirSync(animalsDir, { recursive: true });
}
if (!fs.existsSync(exhibitsDir)) {
  fs.mkdirSync(exhibitsDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Determine destination based on the request path
    const uploadType = req.path.includes("/exhibits/") ? "exhibits" : "animals";
    const uploadsDir = uploadType === "exhibits" ? exhibitsDir : animalsDir;
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with type prefix
    const uploadType = req.path.includes("/exhibits/") ? "exhibit" : "animal";
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uploadType + "-" + uniqueSuffix + ext);
  },
});

// File filter - only accept images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only image files are allowed (jpeg, jpg, png, gif, webp)"));
  }
};

// Create multer upload instance
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
  fileFilter: fileFilter,
});

// Helper function to delete old image file
export const deleteImageFile = (type = "animals", filename) => {
  if (!filename) return;

  const uploadsDir = type === "exhibits" ? exhibitsDir : animalsDir;
  const filePath = path.join(uploadsDir, filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};
