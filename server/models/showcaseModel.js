import mongoose from "mongoose";

const showcaseSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    bannerUrl: { type: String, required: true },
    gender: { type: String, default: "Men" },
    category: { type: String, default: "" },
    subcategory: { type: String, default: "" },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Showcase", showcaseSchema);