import mongoose from "mongoose";

const trendingCardSchema = new mongoose.Schema(
  {
    section: { type: String, default: "Embroidery Tees" },
    gender: { type: String, default: "Men" },
    title: { type: String, required: true },
    mediaUrl: { type: String, required: true },
    mediaType: { type: String, enum: ["image", "video"], default: "image" },
    link: { type: String, required: true }, // e.g. /product/<id> or /products?brandname=Rise Up
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("TrendingCard", trendingCardSchema);