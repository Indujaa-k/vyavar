import asyncHandler from "express-async-handler";
import Showcase from "../models/showcaseModel.js";
import { applySubscriptionPrice } from "../utils/applySubscriptionPrice.js";

const parseIds = (value) => {
  if (!value) return [];
  return typeof value === "string" ? JSON.parse(value) : value;
};

// GET /api/showcases?gender=Men  (public)
export const getShowcases = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.gender) filter.gender = req.query.gender;

  const showcases = await Showcase.find(filter)
    .sort({ order: 1, createdAt: -1 })
    .populate("products")
    .lean();

  const result = showcases.map((s) => ({
    ...s,
    products: (s.products || [])
      .filter(Boolean)
      .map((p) => applySubscriptionPrice(p, req.user)),
  }));

  res.json(result);
});

// POST /api/showcases  (multipart, file field "banner")
export const createShowcase = asyncHandler(async (req, res) => {
  const { title, gender, category, subcategory, order, products } = req.body;

  if (!req.file) {
    res.status(400);
    throw new Error("Banner image is required");
  }

  const showcase = await Showcase.create({
    title: title || "",
    gender: gender || "Men",
    category: category || "",
    subcategory: subcategory || "",
    order: Number(order) || 0,
    products: parseIds(products),
    bannerUrl: `uploads/${req.file.filename}`,
  });

  res.status(201).json(showcase);
});

// PUT /api/showcases/:id  (banner optional)
export const updateShowcase = asyncHandler(async (req, res) => {
  const showcase = await Showcase.findById(req.params.id);
  if (!showcase) {
    res.status(404);
    throw new Error("Showcase not found");
  }

  const { title, gender, category, subcategory, order, products } = req.body;

  if (title !== undefined) showcase.title = title;
  if (gender) showcase.gender = gender;
  if (category !== undefined) showcase.category = category;
  if (subcategory !== undefined) showcase.subcategory = subcategory;
  if (order !== undefined) showcase.order = Number(order) || 0;
  if (products !== undefined) showcase.products = parseIds(products);
  if (req.file) showcase.bannerUrl = `uploads/${req.file.filename}`;

  res.json(await showcase.save());
});

// DELETE /api/showcases/:id
export const deleteShowcase = asyncHandler(async (req, res) => {
  await Showcase.findByIdAndDelete(req.params.id);
  res.json({ message: "Showcase removed" });
});