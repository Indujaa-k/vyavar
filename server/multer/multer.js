import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

/* ==========================
   ABSOLUTE PROJECT ROOT
   Prevents undefined paths in production
========================== */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, "../../"); // adjust to reach your project root

/* ==========================
   UTILITY: Ensure Directory
========================== */
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

/* ==========================
   STORAGE ENGINE
========================== */
const storage = multer.diskStorage({
  destination(req, file, cb) {
    let relDir = "uploads/others";

    if (file.fieldname === "profilePicture") {
      relDir = "uploads/profiles";
    } else if (file.fieldname === "bannerImage") {
      relDir = "uploads/banners/images";
    } else if (file.fieldname === "images") {
      relDir = "uploads/products/images";
    } else if (
      file.fieldname === "image" &&
      req.originalUrl.includes("/api/banners")
    ) {
      relDir = "uploads/banners/images";
    } else if (file.mimetype.startsWith("video")) {
      relDir = "uploads/banners/videos";
    } else if (file.mimetype === "application/pdf") {
      relDir = "uploads/pdfs";
    }

    const absDir = path.join(PROJECT_ROOT, relDir); // ✅ always absolute
    ensureDir(absDir);
    cb(null, absDir);
  },

  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`,
    );
  },
});

/* ==========================
   FILE FILTER
========================== */
const fileFilter = (req, file, cb) => {
  const allowed = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp",
    "image/avif",
    "image/jfif",
    "video/mp4",
    "video/avi",
    "application/pdf",
    "application/octet-stream",
  ];

  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file type"), false);
  }
};

/* ==========================
   MULTER INSTANCE
========================== */
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
});

/* ==========================
   EXPORTS
========================== */
export const uploadSingleImage = upload.single("image");
export const uploadSingleVideo = upload.single("video");
export const uploadMultipleImages = upload.array("images", 5);
export const uploadReviewImages = upload.array("photos", 3);
export const uploadProfileImage = upload.single("profilePicture");

export const uploadProductFiles = upload.fields([
  { name: "images", maxCount: 50 },
  { name: "sizeChart", maxCount: 1 },
]);
