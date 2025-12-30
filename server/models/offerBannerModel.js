import mongoose from "mongoose";

const offerBannerSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      default: "offer",
    },
    offerText: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const OfferBanner = mongoose.model("OfferBanner", offerBannerSchema);

export default OfferBanner;
