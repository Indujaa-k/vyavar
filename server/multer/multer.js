import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

/* ==========================
   ABSOLUTE PROJECT ROOT
========================== */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, "../../"); // adjust if needed

/* ==========================
   UTILITY: Ensure Directory
========================== */
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
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

    // ✅ Write to absolute path on disk (production safe)
    const absDir = path.join(PROJECT_ROOT, relDir);
    ensureDir(absDir);

    // ✅ Store relDir on file so we can build relative path in filename()
    file._relDir = relDir;

    cb(null, absDir);
  },

  filename(req, file, cb) {
    const filename = `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`;

    // ✅ Override file.path AFTER multer sets it so DB always gets relative path
    // multer sets file.path = destination + "/" + filename
    // We intercept by storing the relative version on the file object
    file._relativePath = `${file._relDir}/${filename}`.replace(/\\/g, "/");

    cb(null, filename);
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
  limits: { fileSize: 100 * 1024 * 1024 },
});

/* ==========================
   MIDDLEWARE WRAPPER
   Rewrites file.path → relative path after multer processes files
   so every controller using file.path gets the correct relative path for DB
========================== */
const rewritePaths = (req, res, next) => {
  // req.file  → single upload
  if (req.file?._relativePath) {
    req.file.path = req.file._relativePath;
  }
  // req.files → array upload
  if (Array.isArray(req.files)) {
    req.files.forEach((f) => {
      if (f._relativePath) f.path = f._relativePath;
    });
  }
  // req.files → fields upload (object of arrays)
  if (req.files && typeof req.files === "object" && !Array.isArray(req.files)) {
    Object.values(req.files).forEach((arr) => {
      arr.forEach((f) => {
        if (f._relativePath) f.path = f._relativePath;
      });
    });
  }
  next();
};

/* ==========================
   EXPORTS — each export now composes upload + rewritePaths
========================== */
export const uploadSingleImage = [upload.single("image"), rewritePaths];
export const uploadSingleVideo = [upload.single("video"), rewritePaths];
export const uploadMultipleImages = [upload.array("images", 5), rewritePaths];
export const uploadReviewImages = [upload.array("photos", 3), rewritePaths];
export const uploadProfileImage = [
  upload.single("profilePicture"),
  rewritePaths,
];

export const uploadProductFiles = [
  upload.fields([
    { name: "images", maxCount: 50 },
    { name: "sizeChart", maxCount: 1 },
  ]),
  rewritePaths,
];
