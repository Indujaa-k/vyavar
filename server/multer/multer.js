import multer from "multer";
import path from "path";
import fs from "fs";

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
    let dir = "uploads/others";

    /* ✅ PROFILE IMAGE */
    if (file.fieldname === "profilePicture") {
      dir = "uploads/profiles";

      /* ✅ BANNER IMAGES */
    } else if (file.fieldname === "bannerImage") {
      dir = "uploads/banners/images";

      /* ✅ PRODUCT IMAGES */
    } else if (file.fieldname === "images") {
      dir = "uploads/products/images";

      /* ✅ REVIEW IMAGES */
    } else if (
      file.fieldname === "image" &&
      req.originalUrl.includes("/api/banners")
    ) {
      dir = "uploads/banners/images";
    } else if (file.mimetype.startsWith("video")) {
      dir = "uploads/banners/videos";

      /* ✅ PDF FILES */
    } else if (file.mimetype === "application/pdf") {
      dir = "uploads/pdfs";
    }

    ensureDir(dir);
    cb(null, dir);
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
    "video/mp4",
    "video/avi",
    "application/pdf",
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
