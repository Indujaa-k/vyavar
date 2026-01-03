import { async } from "regenerator-runtime";
import Product from "../models/productModel.js";
import OfferBanner from "../models/offerBannerModel.js";

import asyncHandler from "express-async-handler";
import path from "path";
import fs from "fs";
import mongoose from "mongoose";

// @desc Create add banners
// @route POST /api/banners
// @access Private / Admin
const addBanner = asyncHandler(async (req, res) => {
  const { title, subtitle, productId, gender } = req.body;
  if (!req.file || !title || !subtitle || !productId || !gender) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: "Product not found." });
  }
  if (product.banners.length >= 4) {
    return res
      .status(400)
      .json({ message: "Maximum of 3 banners allowed per product." });
  }
  const banner = {
    image: req.file.path,
    title,
    subtitle,
    productId,
    gender,
  };
  product.banners.push(banner);
  await product.save();
  res.status(201).json({ message: "Banner added successfully.", banner });
});

// @desc deleteBanner
// @route delete /api/banners/:id
// @access Private/admin
const deleteBanner = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findOne({ "banners._id": id });

  if (!product) {
    return res.status(404).json({ message: "Banner not found." });
  }

  product.banners = product.banners.filter(
    (banner) => banner._id.toString() !== id
  );
  await product.save();

  res.status(200).json({ message: "Banner deleted successfully." });
});

// @desc getBanners
// @route get /api/banners
// @access Private
const getBanners = asyncHandler(async (req, res) => {
  try {
    const { gender } = req.query;
    const productsWithBanners = await Product.find({
      "banners.0": { $exists: true },
    }).select("banners");

    const banners = productsWithBanners.flatMap((product) =>
      product.banners.filter((banner) => ({
        _id: banner._id,
        image: banner.image,
        title: banner.title,
        subtitle: banner.subtitle,
        gender: banner.gender,
        productId: banner.productId,
      }))
    );
    res.status(200).json(banners);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch banners.", error: error.message });
  }
});

// @desc Create addvideobanners
// @route POST /api/videobanners
// @access Private / Admin
const addvideobanner = asyncHandler(async (req, res) => {
  console.log("🎥 Received Upload Request");
  console.log("Request Body:", req.body);
  console.log("Uploaded File:", req.file);

  const { productId } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: "No video uploaded." });
  }

  // ✅ Check product exists
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  // ✅ Create video banner with unique ID
  const videoBanner = {
    _id: new mongoose.Types.ObjectId(), // Unique video ID
    videoUrl: req.file.path,
    uploadedAt: new Date(),
  };

  // ✅ Push to product's VideoBanner array
  product.VideoBanner.push(videoBanner);
  await product.save();

  console.log("✅ Video Banner Added Successfully:", videoBanner);

  res.status(201).json({
    message: "Video banner added successfully",
    videoBanner,
  });
});
// @desc getvideoBanners
// @route get /api/videobanners
// @access Private
const getvideobanner = asyncHandler(async (req, res) => {
  const { productId } = req.query; // Get productId from request body
  if (productId) {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    console.log("Video banners fetched:", product.VideoBanner); // Log output
    return res.json(product.VideoBanner);
  }

  // If no productId, fetch all video banners
  const products = await Product.find({}, "VideoBanner");
  const allVideoBanners = products.flatMap((product) => product.VideoBanner);

  res.json(allVideoBanners);
});
// @desc deletevideoBanner
// @route delete /api/videobanners/:id
// @access Private/admin

const deletevideobanner = asyncHandler(async (req, res) => {
  const { productId, videoId } = req.params; // Get productId & videoId from URL params

  const product = await Product.findById(productId);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  const videoIndex = product.VideoBanner.findIndex(
    (v) => v._id.toString() === videoId
  );

  if (videoIndex === -1) {
    return res.status(404).json({ message: "Video banner not found" });
  }

  // Remove video file from the server
  const videoPath = path.join(
    "uploads",
    product.VideoBanner[videoIndex].videoUrl.split("/").pop()
  );

  if (fs.existsSync(videoPath)) {
    fs.unlinkSync(videoPath);
  }

  // Remove the video from the array
  product.VideoBanner.splice(videoIndex, 1);
  await product.save();

  res.json({ message: "Video banner deleted successfully" });
});
// @desc getallvideoBanners
// @route get /api/allvideobanners
// @access Private
const getUserVideoBanners = asyncHandler(async (req, res) => {
  // Find all products and extract video banners
  const products = await Product.find({}, "VideoBanner");

  // Flatten all video banners into a single array
  const allVideoBanners = products.flatMap((product) => product.VideoBanner);

  res.json(allVideoBanners);
});
export const addOfferBanner = asyncHandler(async (req, res) => {
  const { offerText } = req.body;

  // Check if any active offer already exists
  const existingActive = await OfferBanner.findOne({ isActive: true });

  const banner = await OfferBanner.create({
    offerText,
    isActive: existingActive ? false : true, // ⭐ KEY LOGIC
  });

  res.status(201).json(banner);
});


export const getActiveOfferBanner = asyncHandler(async (req, res) => {
  const banner = await OfferBanner.findOne({ isActive: true });
  res.json(banner);
});

export const getAllOfferBanners = asyncHandler(async (req, res) => {
  const banners = await OfferBanner.find().sort({ createdAt: -1 });
  res.json(banners);
});

export const updateOfferBanner = asyncHandler(async (req, res) => {
  const banner = await OfferBanner.findById(req.params.id);
  if (!banner) {
    res.status(404);
    throw new Error("Offer banner not found");
  }

  banner.offerText = req.body.offerText || banner.offerText;
  banner.isActive = req.body.isActive ?? banner.isActive;

  const updated = await banner.save();
  res.json(updated);
});

export const deleteOfferBanner = asyncHandler(async (req, res) => {
  await OfferBanner.findByIdAndDelete(req.params.id);
  res.json({ message: "Offer banner deleted" });
});
export const activateOfferBanner = asyncHandler(async (req, res) => {
    console.log("Activate Offer ID:", req.params.id);
  const { id } = req.params;


  // Deactivate all offers
  await OfferBanner.updateMany({}, { isActive: false });

  // Activate selected offer
  const banner = await OfferBanner.findByIdAndUpdate(
    id,
    { isActive: true },
    { new: true }
  );

  if (!banner) {
    res.status(404);
    throw new Error("Offer banner not found");
  }

  res.json(banner);
});



export {
  addBanner,
  deleteBanner,
  getBanners,
  addvideobanner,
  getvideobanner,
  deletevideobanner,
  getUserVideoBanners,
  // activateOfferBanner,
};
