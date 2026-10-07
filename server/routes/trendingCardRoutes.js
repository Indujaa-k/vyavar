import express from "express";
import {
  getTrendingCards,
  createTrendingCard,
  updateTrendingCard,
  deleteTrendingCard,
} from "../controlers/trendingCardControler.js";
import upload from "../middleware/upload.js"; // use your real file name
import { protect, adminOrSeller } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getTrendingCards);
router.post("/", protect, adminOrSeller, upload.single("media"), createTrendingCard);
router.put("/:id", protect, adminOrSeller, upload.single("media"), updateTrendingCard);
router.delete("/:id", protect, adminOrSeller, deleteTrendingCard);

export default router;