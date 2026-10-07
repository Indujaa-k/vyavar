import asyncHandler from "express-async-handler";
import TrendingCard from "../models/trendingCardModel.js";

// GET /api/trending-cards?gender=Men  (public)
export const getTrendingCards = asyncHandler(async (req, res) => {
  const filter = { active: true };
  if (req.query.gender) filter.gender = req.query.gender;
  res.json(await TrendingCard.find(filter).sort({ order: 1, createdAt: -1 }));
});

// POST /api/trending-cards  (admin, multipart, field name "media")
export const createTrendingCard = asyncHandler(async (req, res) => {
  const { title, link, gender, order } = req.body;
  if (!req.file || !title || !link) {
    res.status(400);
    throw new Error("media, title and link are required");
  }
  const card = await TrendingCard.create({
    title,
    link,
    gender: gender || "Men",
    order: Number(order) || 0,
   mediaUrl: `uploads/${req.file.filename}`,
    mediaType: req.file.mimetype.startsWith("video") ? "video" : "image",
  });
  res.status(201).json(card);
});

// DELETE /api/trending-cards/:id  (admin)
export const deleteTrendingCard = asyncHandler(async (req, res) => {
  await TrendingCard.findByIdAndDelete(req.params.id);
  res.json({ message: "Card removed" });
});

// PUT /api/trending-cards/:id  (admin, multipart, "media" is optional)
export const updateTrendingCard = asyncHandler(async (req, res) => {
  const card = await TrendingCard.findById(req.params.id);
  if (!card) {
    res.status(404);
    throw new Error("Card not found");
  }

  const { title, link, gender, order } = req.body;
  if (title) card.title = title;
  if (link) card.link = link;
  if (gender) card.gender = gender;
  if (order !== undefined) card.order = Number(order) || 0;

  if (req.file) {
    card.mediaUrl = `uploads/${req.file.filename}`;
    card.mediaType = req.file.mimetype.startsWith("video") ? "video" : "image";
  }

  res.json(await card.save());
});