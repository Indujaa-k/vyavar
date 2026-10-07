import express from "express";
import {
  getShowcases,
  createShowcase,
  updateShowcase,
  deleteShowcase,
} from "../controlers/showcaseControler.js";
import upload from "../middleware/upload.js"; // same import as trendingCardRoutes.js
import { protect, adminOrSeller } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getShowcases);
router.post("/", protect, adminOrSeller, upload.single("banner"), createShowcase);
router.put("/:id", protect, adminOrSeller, upload.single("banner"), updateShowcase);
router.delete("/:id", protect, adminOrSeller, deleteShowcase);

export default router;