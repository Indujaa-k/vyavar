import Product from "../models/productModel.js";
import OfferBanner from "../models/offerBannerModel.js";

import asyncHandler from "express-async-handler";
import path from "path";
import fs from "fs";
import mongoose from "mongoose";
import sharp from "sharp";

const RECOMMENDED_BANNER_SIZE = {
  desktop: "1920x600px",
  mobile: "Generated automatically from the desktop image (full image, scaled down).",
  note: "Images are converted to WebP and compressed automatically.",
};

const BANNER_URL_PREFIX = "/uploads/banners/images";
const BUTTON_POSITIONS = [
  "top-left",
  "top-center",
  "top-right",
  "center",
  "bottom-left",
  "bottom-center",
  "bottom-right",
];

// Only allow internal paths or http(s) links
const cleanLinkUrl = (value) => {
  const v = (value || "").trim();
  if (!v) return "";
  if (v.startsWith("/") || /^https?:\/\//i.test(v)) return v;
  return "";
};

const cleanButtonPosition = (value, fallback = "bottom-left") =>
  BUTTON_POSITIONS.includes(value) ? value : fallback;

// Scale the FULL image down (no cropping) and compress to WebP
const BANNER_WIDTHS = { desktop: 1920, tablet: 1024, mobile: 1080 };

const makeVariant = async (file, variant) => {
  const dir = path.dirname(file.path);
  const base = path.parse(file.filename).name;
  const outName = `${base}-${variant}.webp`;
  const outPath = path.join(dir, outName);

  await sharp(file.path)
    .rotate()
    .resize({ width: BANNER_WIDTHS[variant], withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(outPath);

  return `${BANNER_URL_PREFIX}/${outName}`;
};

// One upload creates all three sizes
const buildBannerImages = async (file) => {
  const result = {};

  if (file) {
    result.image = await makeVariant(file, "desktop");
    result.imageTablet = await makeVariant(file, "tablet");
    result.imageMobile = await makeVariant(file, "mobile");

    // remove the raw upload, only compressed WebP files are kept
    if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
  }

  return result;
};

const removeOldImage = (oldUrl) => {
  if (!oldUrl) return;
  const relativePath = oldUrl.replace(/^https?:\/\/[^/]+/, "");
  const oldPath = path.join(process.cwd(), relativePath);
  if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
};

// @desc Create add banners
// @route POST /api/banners
// @access Private / Admin
const addBanner = asyncHandler(async (req, res) => {
  const {
    title,
    subtitle,
    productId,
    gender,
    fontFamily,
    fontSize,
    fontColor,
    buttonText,
    buttonPosition,
    linkUrl,
  } = req.body;

  const desktopFile = req.files?.image?.[0];

  if (!desktopFile || !productId || !gender) {
    return res.status(400).json({
      message: "Image, productId, and gender are required.",
    });
  }

  const trimmedProductId = productId.trim();

  if (!mongoose.Types.ObjectId.isValid(trimmedProductId)) {
    return res.status(400).json({ message: "Invalid Product ID format." });
  }

  const product = await Product.findById(trimmedProductId);
  if (!product) {
    return res.status(404).json({ message: "Product not found." });
  }

  if (product.banners.length >= 3) {
    return res.status(400).json({
      message: "Maximum of 3 banners allowed per product.",
    });
  }

  const images = await buildBannerImages(desktopFile);
  const hasText = !!(title?.trim() || subtitle?.trim());

  const banner = {
    image: images.image,
    imageTablet: images.imageTablet,
    imageMobile: images.imageMobile,
    title: title?.trim() || "",
    subtitle: subtitle?.trim() || "",
    gender: gender.trim(),
    product: trimmedProductId,
    fontFamily: hasText ? fontFamily?.trim() || "Poppins, sans-serif" : "",
    fontSize: hasText ? fontSize?.trim() || "28px" : "",
    fontColor: hasText ? fontColor?.trim() || "#ffffff" : "",
    buttonText: buttonText?.trim() || "",
    buttonPosition: cleanButtonPosition(buttonPosition),
    linkUrl: cleanLinkUrl(linkUrl),
  };

  product.banners.push(banner);
  await product.save();

  res.status(201).json({
    message: "Banner added successfully.",
    banner,
    recommendedSize: RECOMMENDED_BANNER_SIZE,
  });
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

  const bannerToDelete = product.banners.find((b) => b._id.toString() === id);

  if (bannerToDelete) {
    removeOldImage(bannerToDelete.image);
    removeOldImage(bannerToDelete.imageTablet);
    removeOldImage(bannerToDelete.imageMobile);
  }

  product.banners = product.banners.filter(
    (banner) => banner._id.toString() !== id,
  );

  await product.save();

  res.status(200).json({ message: "Banner deleted successfully." });
});

// @desc Update banner
// @route PUT /api/banners/banner/:id
// @access Private / Admin
const updateBanner = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    title,
    subtitle,
    gender,
    fontFamily,
    fontSize,
    fontColor,
    buttonText,
    buttonPosition,
    linkUrl,
  } = req.body;

  const product = await Product.findOne({ "banners._id": id });

  if (!product) {
    return res.status(404).json({ message: "Banner not found." });
  }

  const banner = product.banners.id(id);
  const desktopFile = req.files?.image?.[0];

  if (desktopFile) {
    const images = await buildBannerImages(desktopFile);
    ["image", "imageTablet", "imageMobile"].forEach((key) => {
      removeOldImage(banner[key]);
      banner[key] = images[key];
    });
  }

  if (title !== undefined) banner.title = title.trim();
  if (subtitle !== undefined) banner.subtitle = subtitle.trim();
  if (gender !== undefined) banner.gender = gender.trim();

  if (buttonText !== undefined) banner.buttonText = buttonText.trim();
  if (buttonPosition !== undefined)
    banner.buttonPosition = cleanButtonPosition(
      buttonPosition,
      banner.buttonPosition,
    );
  if (linkUrl !== undefined) banner.linkUrl = cleanLinkUrl(linkUrl);

  const hasText = !!(banner.title?.trim() || banner.subtitle?.trim());
  banner.fontFamily = hasText
    ? fontFamily?.trim() || banner.fontFamily || "Poppins, sans-serif"
    : "";
  banner.fontSize = hasText ? fontSize?.trim() || banner.fontSize || "28px" : "";
  banner.fontColor = hasText
    ? fontColor?.trim() || banner.fontColor || "#ffffff"
    : "";

  await product.save();

  res.status(200).json({
    message: "Banner updated successfully.",
    banner,
    recommendedSize: RECOMMENDED_BANNER_SIZE,
  });
});

// @desc getBanners
// @route get /api/banners
// @access Private
const getBanners = asyncHandler(async (req, res) => {
  try {
    const productsWithBanners = await Product.find({
      "banners.0": { $exists: true },
    }).select("banners");

    const banners = productsWithBanners.flatMap((product) =>
      product.banners
        .filter((banner) => banner.image)
        .map((banner) => ({
          _id: banner._id,
          image: banner.image,
          imageTablet: banner.imageTablet,
          imageMobile: banner.imageMobile,
          title: banner.title,
          subtitle: banner.subtitle,
          gender: banner.gender,
          productId: banner.product,
          fontFamily: banner.fontFamily,
          fontSize: banner.fontSize,
          fontColor: banner.fontColor,
          buttonText: banner.buttonText,
          buttonPosition: banner.buttonPosition,
          linkUrl: banner.linkUrl,
        })),
    );

    res.status(200).json({ banners, recommendedSize: RECOMMENDED_BANNER_SIZE });
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
  const { productId } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: "No video uploaded." });
  }

  const existingVideo = await Product.findOne({
    "VideoBanner.0": { $exists: true },
  });

  if (existingVideo) {
    return res.status(400).json({
      message: "Only one video banner is allowed in the entire system.",
    });
  }

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  const videoBanner = {
    _id: new mongoose.Types.ObjectId(),
    videoUrl: `/uploads/banners/videos/${req.file.filename}`,
    uploadedAt: new Date(),
  };

  product.VideoBanner.push(videoBanner);
  await product.save();

  res.status(201).json({
    message: "Video banner added successfully",
    videoBanner,
  });
});

// @desc getvideoBanners
// @route get /api/videobanners
// @access Private
const getvideobanner = asyncHandler(async (req, res) => {
  const productWithVideo = await Product.findOne(
    { "VideoBanner.0": { $exists: true } },
    { VideoBanner: 1 },
  );

  if (!productWithVideo) {
    return res.json([]);
  }

  res.json(productWithVideo.VideoBanner);
});

// @desc deletevideoBanner
// @route delete /api/videobanners/:id
// @access Private/admin
const deletevideobanner = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const product = await Product.findOne({
    "VideoBanner._id": videoId,
  });

  if (!product) {
    return res.status(404).json({ message: "Video not found" });
  }

  const video = product.VideoBanner.find((v) => v._id.toString() === videoId);

  if (!video) {
    return res.status(404).json({ message: "Video not found" });
  }

  const relativePath = video.videoUrl.replace(/^https?:\/\/[^/]+/, "");
  const filePath = path.join(process.cwd(), relativePath);

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Video file delete failed:", err.message);
    }
  });

  product.VideoBanner = product.VideoBanner.filter(
    (v) => v._id.toString() !== videoId,
  );

  await product.save();

  res.json({ message: "Video banner deleted successfully" });
});

// @desc getallvideoBanners
// @route get /api/allvideobanners
// @access Private
const getUserVideoBanners = asyncHandler(async (req, res) => {
  const products = await Product.find({}, "VideoBanner");
  const allVideoBanners = products.flatMap((product) => product.VideoBanner);
  res.json(allVideoBanners);
});

export const addOfferBanner = asyncHandler(async (req, res) => {
  const { offerText } = req.body;

  const existingActive = await OfferBanner.findOne({ isActive: true });

  const banner = await OfferBanner.create({
    offerText,
    isActive: existingActive ? false : true,
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
  const { id } = req.params;

  await OfferBanner.updateMany({}, { isActive: false });

  const banner = await OfferBanner.findByIdAndUpdate(
    id,
    { isActive: true },
    { new: true },
  );

  if (!banner) {
    res.status(404);
    throw new Error("Offer banner not found");
  }

  res.json(banner);
});

export {
  addBanner,
  updateBanner,
  deleteBanner,
  getBanners,
  addvideobanner,
  getvideobanner,
  deletevideobanner,
  getUserVideoBanners,
};