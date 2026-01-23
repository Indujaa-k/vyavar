import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import multer from "multer";
import XLSX from "xlsx";
import Product from "../models/productModel.js";
import ProductGroup from "../models/productgroupModel.js";
import User from "../models/userModel.js";
import reviewnotificatioEmail from "../utils/reviewnotificationEmail.js";
import { uploadImagesToCloudinary } from "../multer/multer.js";
import upload from "../middleware/upload.js";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import { applySubscriptionPrice } from "../utils/applySubscriptionPrice.js";

// @desc Fetch all products
// @route GET /api/products
// @access Public
const getProducts = asyncHandler(async (req, res) => {
  const {
    brandname,
    gender,
    offerfilter,
    category,
    subcategory,
    type,
    color,
    fabric,
    sizes,
    from,
    to,
    discount,
    rating,
    sortBy,
    keyword,
  } = req.query;
  const keywordFilter = keyword
    ? {
        $or: [
          { brandname: { $regex: keyword, $options: "i" } }, // Search in brandname
          { "productdetails.category": { $regex: keyword, $options: "i" } }, // Search in category
          { "productdetails.subcategory": { $regex: keyword, $options: "i" } }, // Search in subcategory
          { "productdetails.color": { $regex: keyword, $options: "i" } }, // Search in color
          { "productdetails.fabric": { $regex: keyword, $options: "i" } }, // Search in fabric
          { "productdetails.type": { $regex: keyword, $options: "i" } }, // Search in type
        ],
      }
    : {};
  let filterCriteria = {
    ...keywordFilter,
  };
  if (brandname) filterCriteria.brandname = brandname;
  if (gender) filterCriteria["productdetails.gender"] = gender;
  if (category) filterCriteria["productdetails.category"] = category;
  if (subcategory) filterCriteria["productdetails.subcategory"] = subcategory;
  if (type) filterCriteria["productdetails.type"] = type;
  if (color) filterCriteria["productdetails.color"] = color;
  if (fabric) filterCriteria["productdetails.fabric"] = fabric;
  if (sizes) {
    filterCriteria["productdetails.stockBySize"] = {
      $elemMatch: { size: sizes, stock: { $gt: 0 } },
    };
  }

  if (offerfilter) {
    switch (offerfilter) {
      case "under499":
        filterCriteria.price = { $lte: 499 };
        break;
      case "under1499":
        filterCriteria.price = { $lte: 1499 };
        break;
      case "upto50":
        filterCriteria.discount = { $gte: 50 };
        break;
      case "upto70":
        filterCriteria.discount = { $gte: 70 };
        break;
      default:
        console.log("Invalid Offer Filter");
    }
  }
  console.log("Final Filter Criteria:", filterCriteria);
  // Price Range Filter
  if (from && to) {
    filterCriteria.price = { $gte: from, $lte: to };
  } else if (from) {
    filterCriteria.price = { $gte: from };
  } else if (to) {
    filterCriteria.price = { $lte: to };
  }
  // Discount Filter
  if (discount) {
    filterCriteria.discount = { $gte: discount }; // Get products with at least this discount
  }

  // Rating Filter
  if (rating) {
    filterCriteria.rating = { $gte: rating }; // Get products with at least this rating
  }

  // Sorting Logic
  let sortOptions = {};
  switch (sortBy) {
    case "Rating":
      sortOptions.rating = -1;
      break;
    case "date":
      sortOptions.createdAt = -1;
      break;
    case "highprice":
      sortOptions.price = -1;
      break;
    case "lowprice":
      sortOptions.price = 1;
      break;
    default:
      sortOptions.createdAt = -1; // Default: Newest first
  }

  // Fetch Products
  const products = await Product.find(filterCriteria).sort(sortOptions).lean();

  const finalProducts = products.map((product) =>
    applySubscriptionPrice(product, req.user),
  );

  res.json(finalProducts);
});

// @desc Fetch single  product
// @route GET /api/products/:id
// @access Public
// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate({
      path: "reviews.user",
      select: "name profilePicture",
    })
    .lean(); // plain JS object

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // ✅ Filter only approved reviews
  const approvedReviews = product.reviews.filter((r) => r.approved === true);

  // ✅ Apply subscription price
  const pricedProduct = applySubscriptionPrice(product, req.user);

  // ✅ Attach approved reviews
  pricedProduct.reviews = approvedReviews;

  res.json(pricedProduct);
});

const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  if (!rating || !comment) {
    res.status(400);
    throw new Error("Rating and comment required");
  }

  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // ✅ PHOTOS OPTIONAL
  let photos = [];
  if (req.files && req.files.length > 0) {
    photos = req.files.map((file) => file.path);
  }

  const review = {
    name: req.user.name,
    rating: Number(rating),
    comment,
    photos, // [] if no images
    user: req.user._id,
    approved: false,
  };

  product.reviews.push(review);

  product.numReviews = product.reviews.length;
  product.rating =
    product.reviews.reduce((acc, r) => acc + r.rating, 0) /
    product.reviews.length;

  await product.save();

  res.status(201).json({ message: "Review added successfully" });
});

// Alternative: If you want a separate endpoint for variants
const getProductVariants = async (req, res) => {
  try {
    const { sku } = req.params;

    // Extract prefix from the given SKU
    const skuPrefix = sku.split("-")[0];

    // Find all products with this prefix
    const variants = await Product.find({
      SKU: { $regex: `^${skuPrefix}-` },
    }).select("SKU productdetails.color images brandname price");

    res.json(variants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getProductBySku = asyncHandler(async (req, res) => {
  const { sku } = req.params;

  // 1️⃣ Find current product
  const product = await Product.findOne({ SKU: sku });

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // 2️⃣ Extract unified/base SKU (before first "-")
  const baseSKU = sku.split("-")[0];

  // 3️⃣ Find all color variants
  const variants = await Product.find({
    SKU: { $regex: `^${baseSKU}-` },
  }).select("SKU productdetails.color images price productdetails.stockBySize");

  // 4️⃣ Response
  res.json({
    product: applySubscriptionPrice(product.toObject(), req.user),
    variants: variants.map((v) =>
      applySubscriptionPrice(v.toObject(), req.user),
    ),
  });
});

// @desc Add product to cart
// @route POST /api/products/:id/addtocart
// @access Private
// const addToCart = asyncHandler(async (req, res) => {
//   const userId = req.user._id;
//   const { qty = 1, size, action = "add", cartItemId } = req.body; // default qty=1

//   if (cartItemId && !existingCartItem) {
//     return res.status(404).json({ message: "Cart item not found" });
//   }

//   if (!size) return res.status(400).json({ message: "Size is required" });
//   if (qty < 0) return res.status(400).json({ message: "Invalid quantity" });

//   const product = await Product.findById(req.params.id);
//   if (!product) return res.status(404).json({ message: "Product not found" });

//   const user = await User.findById(userId);
//   if (!user) return res.status(404).json({ message: "User not found" });

//   user.cartItems = user.cartItems || [];

//   const sizeStock = product.productdetails?.stockBySize?.find(
//     (s) => s.size === size
//   );

//   if (!sizeStock)
//     return res.status(400).json({ message: "Size not available" });

//   let existingCartItem = null;

//   // 1️⃣ If cartItemId exists → update THAT item (size change case)
//   if (cartItemId) {
//     existingCartItem = user.cartItems.id(cartItemId);
//   }

//   // 2️⃣ Else → normal add/find by product + size
//   if (!existingCartItem) {
//     existingCartItem = user.cartItems.find(
//       (item) =>
//         item.product.toString() === product._id.toString() && item.size === size
//     );
//   }

//   if (existingCartItem && qty === 0) {
//     user.cartItems = user.cartItems.filter(
//       (item) => item._id.toString() !== existingCartItem._id.toString()
//     );
//   } else if (existingCartItem) {
//     const pricedProduct = applySubscriptionPrice(product.toObject(), user);

//     // update size & qty safely
//     existingCartItem.size = size;

//     if (action === "set") {
//       existingCartItem.qty = qty;
//     } else {
//       existingCartItem.qty += 1;
//     }

//     // stock check
//     if (existingCartItem.qty > sizeStock.stock) {
//       return res.status(400).json({ message: "Not enough stock available" });
//     }

//     // recalc price
//     existingCartItem.price =
//       existingCartItem.qty * pricedProduct.subscriptionPrice;
//   } else {
//     const pricedProduct = applySubscriptionPrice(product.toObject(), user);

//     user.cartItems.push({
//       product: product._id,
//       qty,
//       size,
//       price: qty * pricedProduct.subscriptionPrice, // ✅ CORRECT
//     });
//   }

//   await user.save();

//   // const updatedUser = await User.findById(userId).populate("cartItems.product");

//   const updatedUser = await User.findById(userId).populate({
//     path: "cartItems.product",
//     select:
//       "name brandname images oldPrice isSubscriptionApplied subscriptionDiscountPercent productdetails",
//   });

//   res.status(200).json({ cartItems: updatedUser.cartItems });
// });

const addToCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { qty = 1, size, action = "add", cartItemId } = req.body;

  if (!size) return res.status(400).json({ message: "Size is required" });
  if (qty < 0) return res.status(400).json({ message: "Invalid quantity" });

  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.cartItems = user.cartItems || [];

  const sizeStock = product.productdetails?.stockBySize?.find(
    (s) => s.size === size,
  );

  if (!sizeStock)
    return res.status(400).json({ message: "Size not available" });

  let existingCartItem = null;

  // 1️⃣ If cartItemId exists → update THAT item
  if (cartItemId) {
    existingCartItem = user.cartItems.id(cartItemId);

    if (!existingCartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }
  }

  // 2️⃣ Else → find by product + size
  if (!existingCartItem) {
    existingCartItem = user.cartItems.find(
      (item) =>
        item.product.toString() === product._id.toString() &&
        item.size === size,
    );
  }

  if (existingCartItem && qty === 0) {
    user.cartItems = user.cartItems.filter(
      (item) => item._id.toString() !== existingCartItem._id.toString(),
    );
  } else if (existingCartItem) {
    const pricedProduct = applySubscriptionPrice(product.toObject(), user);

    existingCartItem.size = size;

    if (action === "set") {
      existingCartItem.qty = qty;
    } else {
      existingCartItem.qty += 1;
    }

    if (existingCartItem.qty > sizeStock.stock) {
      return res.status(400).json({ message: "Not enough stock available" });
    }

    existingCartItem.price =
      existingCartItem.qty * pricedProduct.subscriptionPrice;
  } else {
    const pricedProduct = applySubscriptionPrice(product.toObject(), user);

    user.cartItems.push({
      product: product._id,
      qty,
      size,
      price: qty * pricedProduct.subscriptionPrice,
    });
  }

  await user.save();

  const updatedUser = await User.findById(userId).populate({
    path: "cartItems.product",
    select:
      "name brandname images oldPrice isSubscriptionApplied subscriptionDiscountPercent productdetails",
  });

  res.status(200).json({ cartItems: updatedUser.cartItems });
});

// @desc get cart product
// @route get /api/products/getcart
// @access Private
const getCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: "cartItems.product",
    select:
      "name images brandname description price oldPrice discount productdetails",
  });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const cartItems = user.cartItems.map((item) => {
    const pricedProduct = applySubscriptionPrice(item.product.toObject(), user);

    return {
      ...item.toObject(),
      product: pricedProduct,
    };
  });

  res.status(200).json({ cartItems });
});

// @desc detlete cart product
// @route delete /api/products/deletecart
// @access Private

// const deleteCartItem = asyncHandler(async (req, res) => {
//   const userId = req.user._id; // Logged-in user's ID
//   const { cartItemId } = req.params; // Cart item ID to delete

//   console.log("Cart Item ID from request:", cartItemId);

//   // Use MongoDB's $pull operator to remove the item by its `_id`
//   const updatedUser = await User.findByIdAndUpdate(
//     userId,
//     {
//       $pull: { cartItems: { _id: cartItemId } }, // Match by cart item `_id`
//     },
//     { new: true } // Return the updated document
//   ).populate("cartItems.product"); // Populate product details after update

//   if (!updatedUser) {
//     res.status(404);
//     throw new Error("User not found");
//   }

//   console.log("Updated Cart Items:", updatedUser.cartItems);

//   // Send the updated cart back to the client
//   res.status(200).json(updatedUser);
// });

// @desc Delete cart product
// @route DELETE /api/products/deletecart/:cartItemId
// @access Private
const deleteCartItem = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { cartItemId } = req.params;

  const user = await User.findById(userId).populate("cartItems.product");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // 🔍 FIND THE CART ITEM (IMPORTANT)
  const cartItem = user.cartItems.find(
    (item) => item._id.toString() === cartItemId,
  );

  if (!cartItem) {
    return res.status(404).json({ message: "Cart item not found" });
  }

  // 🔁 RESTORE STOCK
  const product = await Product.findById(cartItem.product._id);

  if (product) {
    const sizeStock = product.productdetails.stockBySize.find(
      (s) => s.size === cartItem.size,
    );

    if (sizeStock) {
      sizeStock.stock += cartItem.qty;

      await product.save();
    }
  }

  // 🗑 REMOVE ITEM
  user.cartItems = user.cartItems.filter(
    (item) => item._id.toString() !== cartItemId,
  );

  await user.save();

  const updatedUser = await User.findById(userId).populate("cartItems.product");

  res.status(200).json({
    cartItems: updatedUser.cartItems,
  });
});

// @desc Delete a product
// @route GET /api/products/:id
// @access Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product Removed" });
  } else {
    // status it's 500 by default cuz of errHandler
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc Create a product
// @route Post /api/products
// @access Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  console.log("BODY:", req.body);
  console.log("FILES:", req.files);

  try {
    const {
      brandname,
      description,
      SKU,
      shippingDetails,
      isFeatured,
      products,
      productType = "single",
      comboName = "",
    } = req.body;

    if (!products) {
      return res.status(400).json({ message: "No product variants provided" });
    }

    const parsedProducts =
      typeof products === "string" ? JSON.parse(products) : products;

    const parsedShippingDetails =
      typeof shippingDetails === "string"
        ? JSON.parse(shippingDetails)
        : shippingDetails;

    // 🔥 GROUP ID
    const productGroupId = new mongoose.Types.ObjectId().toString();

    const sizeChart = req.files?.sizeChart?.[0]?.path || "";
    const allImages = req.files?.images || [];

    //     // ✅ TOTAL IMAGE VALIDATION
    //     const minImages = parsedProducts.length * 3;
    //     const maxImages = parsedProducts.length * 5;

    //     if (allImages.length < minImages || allImages.length > maxImages) {
    //       return res.status(400).json({
    //         message: `Each variant must have 3–5 images.
    // Expected ${minImages}–${maxImages}, got ${allImages.length}`,
    //       });
    //     }

    let imageIndex = 0;
    const createdProducts = [];

    // ✅ SINGLE LOOP (FIXED)
    for (let i = 0; i < parsedProducts.length; i++) {
      const variant = parsedProducts[i];

      const imageCount = Number(variant.imagesCount || 3);

      if (imageCount < 3 || imageCount > 5) {
        return res.status(400).json({
          message: `Variant ${variant.productdetails.color} must have 3–5 images`,
        });
      }

      const images = allImages
        .slice(imageIndex, imageIndex + imageCount)
        .map((file) => file.path);

      imageIndex += imageCount;
      if (productType === "combo") {
        variant.productdetails.subcategory = "Combo";
      }

      const product = new Product({
        user: req.user._id,
        brandname,
        description,
        productType,
        comboName: productType === "combo" ? comboName : "",

        price: Number(variant.price),
        oldPrice: Number(variant.oldPrice),
        discount: Number(variant.discount),

        images,
        sizeChart,
        productGroupId,

        SKU: `${SKU}-${variant.productdetails.color.toUpperCase()}-${Date.now()}`,

        productdetails: variant.productdetails,
        shippingDetails: parsedShippingDetails,
        isFeatured: isFeatured === "true",

        rating: 0,
        numReviews: 0,
      });

      createdProducts.push(await product.save());
    }

    res.status(201).json({
      message: "Product variants created successfully",
      productGroupId,
      products: createdProducts,
    });
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});

// @desc Mark review as Helpful / Not Helpful
// @route PUT /api/products/:id/review/helpful
// @access Private

// @desc Update a product
// @route PUT /api/products/:id
// @access Private/Admin

const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Basic fields
  product.brandname = req.body.brandname || product.brandname;
  product.description = req.body.description || product.description;
  product.oldPrice = req.body.oldPrice || product.oldPrice;
  product.discount = req.body.discount || product.discount;
  product.price = req.body.price || product.price;
  product.SKU = req.body.SKU || product.SKU;
  product.isFeatured = req.body.isFeatured ?? product.isFeatured;

  // JSON fields
  if (req.body.productdetails) {
    product.productdetails = JSON.parse(req.body.productdetails);
  }

  if (req.body.shippingDetails) {
    product.shippingDetails = JSON.parse(req.body.shippingDetails);
  }

  // Images (optional replace)
  if (req.files?.images?.length > 0) {
    product.images = req.files.images.map((file) => file.path);
  }

  // Size chart (optional)
  if (req.files?.sizeChart?.length > 0) {
    product.sizeChart = req.files.sizeChart[0].path;
  }

  const updatedProduct = await product.save();
  res.json(updatedProduct);
});

// @desc Create a bulk product
// @route Post /api/products
// @access Private/Admin
export const markReviewHelpful = async (req, res) => {
  const { productId, reviewId } = req.params;

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  const review = product.reviews.id(reviewId);
  if (!review) {
    return res.status(404).json({ message: "Review not found" });
  }

  review.helpful = (review.helpful || 0) + 1;

  await product.save();
  res.json({ message: "Marked as helpful" });
};
export const markReviewNotHelpful = async (req, res) => {
  const { productId, reviewId } = req.params;

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  const review = product.reviews.id(reviewId);
  if (!review) {
    return res.status(404).json({ message: "Review not found" });
  }

  review.notHelpful = (review.notHelpful || 0) + 1;

  await product.save();
  res.json({ message: "Marked as not helpful" });
};
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_APIKEY,
  api_secret: process.env.CLOUDINARY_SECRETKEY,
});
const uploadProducts = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("Excel file required");
  }

  const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet);

  const groupMap = {}; // ExcelGroupId → MongoGroupId
  let created = 0;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    if (!row.SKU || !row.productGroupId) {
      throw new Error(`Row ${i + 2}: SKU & productGroupId required`);
    }

    // 🔹 Uniform Mongo productGroupId
    if (!groupMap[row.productGroupId]) {
      groupMap[row.productGroupId] = row.productGroupId;
    }

    // 🔹 Upload images
    let images = [];
    if (row.images) {
      const paths = row.images.split("|");
      for (const p of paths) {
        if (fs.existsSync(p)) {
          const upload = await cloudinary.uploader.upload(p, {
            folder: "products",
          });
          images.push(upload.secure_url);
        }
      }
    }

    // 🔹 Sizes & stock
    const sizes = row.sizes.split(",");
    const stockBySize = row.stockBySize.split(",").map((s) => {
      const [size, stock] = s.split(":");
      return { size, stock: Number(stock) };
    });

    const oldPrice = Number(row.oldPrice);
    const discount = Number(row.discount || 0);
    const price = oldPrice - (oldPrice * discount) / 100;

    await Product.create({
      user: req.user._id,
      SKU: row.SKU,
      productGroupId: groupMap[row.productGroupId],

      brandname: row.brandname || "Default Brand",
      description: row.description || "",

      images,
      price,
      oldPrice,
      discount,

      productdetails: {
        gender: row.gender || "unisex",
        category: row.category || "general",
        subcategory: row.subcategory || "general",
        type: row.type || "general",
        ageRange: row.ageRange || "all",
        fabric: row.fabric || "cotton",
        color: row.color,
        sizes,
        stockBySize,
      },

      // ✅ AUTO-FILLED SHIPPING DETAILS
      shippingDetails: {
        weight: 0.5,
        dimensions: {
          length: 10,
          width: 10,
          height: 2,
        },
        originAddress: {
          street1: "Warehouse",
          city: "Chennai",
          state: "Tamil Nadu",
          zip: 600001,
          country: "India",
        },
      },
    });

    created++;
  }

  res.status(201).json({
    message: "Bulk upload successful",
    productsCreated: created,
  });
});

// @desc Create new Review
// @route PUT /api/products/:id/reviews
// @access Private
// const createproductreview = asyncHandler(async (req, res) => {
//   console.log("Incoming Review Request:", req.body);
//   const { rating, comment } = req.body;

//   // ✅ Fetch existing product instead of creating a new one
//   const product = await Product.findById(req.params.id);

//   if (!product) {
//     return res.status(404).json({ message: "Product not found" });
//   }

//   const alreadyReviewed = product.reviews.find(
//     (r) => r.user.toString() === req.user._id.toString()
//   );
//   if (alreadyReviewed) {
//     res.status(400);
//     throw new Error("Product already reviewed");
//   }

//   const review = {
//     name: req.user.name,
//     rating: Number(rating),
//     comment,
//     user: req.user._id,
//     approved: false,
//     profilePicture: req.user.profilePicture,
//   };

//   product.reviews.push(review);
//   product.numReviews = product.reviews.length;
//   product.rating =
//     product.reviews.reduce((acc, item) => item.rating + acc, 0) /
//     product.reviews.length;

//   await product.save();

//   /* ================= MAIL SECTION ================= */

//   try {
//     console.log("➡️ Sending admin mail...");

//     await reviewnotificatioEmail({
//       to: process.env.ADMIN_EMAIL,
//       subject: "📝 New Product Review Submitted",
//       text: `
// Product: ${product.brandname}
// Reviewer: ${req.user.name}
// Rating: ${rating}
// Comment: ${comment}
//     `,
//     });

//     console.log("✅ Admin mail sent");

//     console.log("➡️ Fetching sellers...");
//     const sellers = await User.find({
//       isSeller: true,
//       email: { $exists: true, $ne: "" },
//     });
//     console.log("🧾 SELLERS FOUND COUNT:", sellers.length);

//     if (sellers.length === 0) {
//       console.log("❌ SELLER NOT FOUND");
//     }

//     for (const seller of sellers) {
//       console.log("📧 Sending mail to seller:", seller.email);

//       await reviewnotificatioEmail({
//         to: seller.email,
//         subject: "📝 New Product Review Submitted",
//         text: `
// Product: ${product.brandname}
// Rating: ${rating}
// Comment: ${comment}
//       `,
//       });
//     }

//     console.log("✅ Seller mail section completed");
//   } catch (err) {
//     console.error("❌ MAIL ERROR:", err);
//   }

//   /* ================= END MAIL ================= */

//   // 🔥 SEND RESPONSE ONLY AFTER ALL LOGIC
//   res.status(201).json({ message: "Review added & notifications sent" });
// });

// const createproductreview = asyncHandler(async (req, res) => {
//   console.log("Incoming Review Request:", req.body);

//   const { rating, comment } = req.body;
//   const product = await Product.findById(req.params.id);

//   if (!product) {
//     return res.status(404).json({ message: "Product not found" });
//   }

//   const alreadyReviewed = product.reviews.find(
//     (r) => r.user.toString() === req.user._id.toString()
//   );

//   if (alreadyReviewed) {
//     res.status(400);
//     throw new Error("Product Already Reviewed");
//   }

//   const review = {
//     name: req.user.name,
//     rating: Number(rating),
//     comment,
//     user: req.user._id,
//     approved: false,
//   };

//   product.reviews.push(review);
//   product.numReviews = product.reviews.length;
//   product.rating =
//     product.reviews.reduce((acc, item) => item.rating + acc, 0) /
//     product.reviews.length;

//   await product.save();

//   // ⭐ Email notification to admin
//   const adminEmail = process.env.ADMIN_EMAIL;

//   const emailMessage = `
//     <h2>New Review Submitted</h2>
//     <p>A new review has been submitted and needs your approval.</p>
//     <h3>Review Details</h3>
//     <p><strong>User:</strong> ${req.user.name}</p>
//     <p><strong>Rating:</strong> ${rating}</p>
//     <p><strong>Comment:</strong> ${comment}</p>
//     <p><strong>Product:</strong> ${product.brandname}</p>
//     <br/>
//     <a href="https://your-admin-panel-url.com/reviews">Click here to approve reviews</a>
//   `;

//   await sendEmail(
//     adminEmail,
//     "New Product Review Awaiting Approval",
//     emailMessage
//   );

//   res.status(201).json({ message: "Review added & admin notified" });
// });

// @desc Approve Review
// @route PUT /api/products/approve review
// @access Private

const approveReview = asyncHandler(async (req, res) => {
  console.log(
    "🔍 Approving Review - Product ID:",
    req.params.id,
    "Review ID:",
    req.params.reviewId,
  );

  const product = await Product.findById(req.params.id);

  if (!product) {
    console.error("❌ ERROR: Product not found");
    return res.status(404).json({ message: "Product not found" });
  }

  const review = product.reviews.find(
    (r) => r._id.toString() === req.params.reviewId,
  );

  if (!review) {
    console.error("❌ ERROR: Review not found inside product");
    return res.status(404).json({ message: "Review not found" });
  }

  review.approved = true; // ✅ Mark review as approved

  try {
    console.log("✅ Before Saving:", product.reviews); // ✅ Debugging before saving

    await product.save(); // ✅ Save changes to database

    console.log("✅ After Saving:", product.reviews); // ✅ Debugging after saving
    res.json({ message: "Review approved" });
  } catch (error) {
    console.error("❌ ERROR Saving Review:", error);
    res.status(500).json({ message: "Error saving approved review" });
  }
});

// @desc Pending Review
// @route get /api/products/pending review
// @access Private
const getPendingReviews = asyncHandler(async (req, res) => {
  try {
    // Get all products with unapproved reviews
    const products = await Product.find({ "reviews.approved": false }).select(
      "reviews brandname images",
    ); // include images

    const pendingReviews = [];

    products.forEach((product) => {
      product.reviews.forEach((review) => {
        if (!review.approved) {
          pendingReviews.push({
            _id: review._id.toString(),
            productId: product._id.toString(),
            brandname: product.brandname,
            image:
              product.images && product.images.length > 0
                ? product.images[0]
                : null, // ✅ include first image
            name: review.name,
            rating: review.rating,
            comment: review.comment,
            photos: review.photos || [],
            createdAt: review.createdAt,
          });
        }
      });
    });

    res.json(pendingReviews);
  } catch (error) {
    console.error("Error fetching pending reviews:", error);
    res.status(500).json({ message: "Failed to fetch pending reviews" });
  }
});

// Alternative: Delete review by review ID only (searches across all products)
const deleteReviewById = async (req, res) => {
  console.log("Backend received reviewId:", req.params.reviewId);
  try {
    const { reviewId } = req.params;
    console.log("🚀 deleteReviewById called with reviewId:", reviewId);

    // Find the product that contains this review
    const product = await Product.findOne({ "reviews._id": reviewId });
    console.log("🔍 Product found for review:", product ? product._id : null);

    if (!product) {
      return res
        .status(404)
        .json({ message: "Review not found in any product" });
    }

    // Remove the review
    product.reviews = product.reviews.filter(
      (r) => r._id.toString() !== reviewId,
    );

    // Recalculate rating
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.length > 0
        ? product.reviews.reduce((acc, r) => acc + r.rating, 0) /
          product.reviews.length
        : 0;

    await product.save();

    console.log("✅ Review deleted successfully");
    res.json({ success: true, message: "Review deleted" });
  } catch (error) {
    console.error("❌ deleteReviewById error:", error);
    res.status(500).json({ message: error.message });
  }
};

// controllers/productController.js

const getProductFullById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).lean();
  if (!product) return res.status(404).json({ message: "Product not found" });

  const variants = await Product.find({
    productGroupId: product.productGroupId,
  }).lean();

  const group = await ProductGroup.findById(product.productGroupId).lean();

  res.json({
    product: applySubscriptionPrice(product, req.user),
    variants: variants.map((v) => applySubscriptionPrice(v, req.user)),
    group,
  });
});

const updateGroupCommonFields = asyncHandler(async (req, res) => {
  const products = await Product.updateMany(
    { productGroupId: req.params.groupId },
    {
      $set: {
        brandname: req.body.brandname,
        description: req.body.description,
        shippingDetails: req.body.shippingDetails,
        isFeatured: req.body.isFeatured,
        "productdetails.gender": req.body.gender,
        "productdetails.category": req.body.category,
        "productdetails.subcategory": req.body.subcategory,
        "productdetails.type": req.body.type,
        "productdetails.fabric": req.body.fabric,
        "productdetails.ageRange": req.body.ageRange,
      },
    },
  );

  res.json({ message: "Common fields updated" });
});

const addVariantToGroup = asyncHandler(async (req, res) => {
  const { groupId } = req.params;

  let { color, sizes, stockBySize, oldPrice, discount, price } = req.body;

  if (typeof sizes === "string") sizes = JSON.parse(sizes);
  if (typeof stockBySize === "string") stockBySize = JSON.parse(stockBySize);

  oldPrice = Number(oldPrice);
  discount = Number(discount);
  price = Number(price);

  const files = req.files || [];

  // ✅ BASIC VALIDATION
  if (!color || !sizes || !stockBySize) {
    res.status(400);
    throw new Error("Variant fields are missing");
  }

  // ✅ IMAGE VALIDATION (3–5)
  if (files.length < 3 || files.length > 5) {
    res.status(400);
    throw new Error("Each variant must have between 3 and 5 images");
  }

  const images = files.map((file) => file.path);

  // ✅ FIND BASE PRODUCT
  const baseProduct = await Product.findOne({ productGroupId: groupId });
  if (!baseProduct) {
    res.status(404);
    throw new Error("Product group not found");
  }

  // ✅ PREVENT DUPLICATE COLOR
  const existingVariant = await Product.findOne({
    productGroupId: groupId,
    "productdetails.color": color,
  });

  if (existingVariant) {
    res.status(400);
    throw new Error("Variant with this color already exists");
  }

  // ✅ SKU GENERATION
  const SKU = `${
    baseProduct.SKU.split("-")[0]
  }-${color.toUpperCase()}-${Date.now()}`;

  // ✅ CREATE VARIANT
  const newVariant = new Product({
    productGroupId: groupId,
    brandname: baseProduct.brandname,
    description: baseProduct.description,
    shippingDetails: baseProduct.shippingDetails,
    isFeatured: baseProduct.isFeatured,

    oldPrice,
    discount,
    price,
    SKU,
    images,

    productdetails: {
      gender: baseProduct.productdetails.gender,
      category: baseProduct.productdetails.category,
      subcategory: baseProduct.productdetails.subcategory,
      type: baseProduct.productdetails.type,
      fabric: baseProduct.productdetails.fabric,
      ageRange: baseProduct.productdetails.ageRange,
      color,
      sizes,
      stockBySize,
    },

    user: req.user._id,
    rating: 0,
    numReviews: 0,
  });

  const createdVariant = await newVariant.save();

  res.status(201).json({
    message: "Variant added successfully",
    variant: createdVariant,
  });
});

const updateProductGroup = asyncHandler(async (req, res) => {
  const { groupId } = req.params;
  const { brandname, description, price, oldPrice, discount, isFeatured } =
    req.body;

  // Only fields that should propagate
  const updateFields = {
    ...(brandname && { brandname }),
    ...(description && { description }),
    ...(price !== undefined && { price }),
    ...(oldPrice !== undefined && { oldPrice }),
    ...(discount !== undefined && { discount }),
    ...(isFeatured !== undefined && { isFeatured }),
  };

  const updatedProducts = await Product.updateMany(
    { productGroupId: groupId },
    { $set: updateFields },
    { new: true },
  );

  if (!updatedProducts) {
    res.status(404);
    throw new Error("Product group not found");
  }

  res.json({
    message: "Product group updated successfully",
    updatedCount: updatedProducts.nModified,
  });
});

const getProductsByGroupId = asyncHandler(async (req, res) => {
  const { groupId } = req.params;

  if (!groupId) {
    res.status(400);
    throw new Error("Group ID is required");
  }

  const products = await Product.find({ productGroupId: groupId }).lean();

  const finalProducts = products.map((product) =>
    applySubscriptionPrice(product, req.user),
  );

  if (!products) {
    res.status(404);
    throw new Error("No products found for this group");
  }

  res.json(finalProducts); // ✅ Must return JSON
});
const getProductGroup = asyncHandler(async (req, res) => {
  const products = await Product.find({
    productGroupId: req.params.groupId,
  });

  if (!products.length) {
    res.status(404);
    throw new Error("Product group not found");
  }

  // parent/common fields from first product
  const base = products[0];

  res.json({
    common: {
      brandname: base.brandname,
      description: base.description,
      shippingDetails: base.shippingDetails,
      isFeatured: base.isFeatured,
      productdetails: {
        gender: base.productdetails.gender,
        category: base.productdetails.category,
        subcategory: base.productdetails.subcategory,
        type: base.productdetails.type,
        fabric: base.productdetails.fabric,
        ageRange: base.productdetails.ageRange,
      },
    },
    variants: products,
  });
});
const updateVariant = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Variant not found");
  }

  // prices
  if (req.body.oldPrice !== "") product.oldPrice = Number(req.body.oldPrice);
  if (req.body.discount !== "") product.discount = Number(req.body.discount);
  if (req.body.price !== "") product.price = Number(req.body.price);

  // details
  if (req.body.color) product.productdetails.color = req.body.color;
  if (req.body.sizes) product.productdetails.sizes = JSON.parse(req.body.sizes);
  if (req.body.stockBySize)
    product.productdetails.stockBySize = JSON.parse(req.body.stockBySize);

  // ✅ IMAGE REPLACEMENT (IMPORTANT PART)
  if (req.files && req.files.length > 0) {
    let imageIndexes = req.body.imageIndexes;

    if (typeof imageIndexes === "string") {
      imageIndexes = [imageIndexes];
    }

    req.files.forEach((file, i) => {
      const index = Number(imageIndexes[i]);
      if (!isNaN(index) && product.images[index]) {
        product.images[index] = file.secure_url || file.path;
      }
    });
  }

  const updated = await product.save();
  res.json(updated);
});
// @desc Unapprove Review
// @route PUT /api/products/:id/reviews/:reviewId/unapprove
// @access Private/Admin

// controllers/reviewController.js
// @desc Unapprove Review
// @route PUT /api/products/:id/reviews/:reviewId/unapprove
// @access Private/Admin
const unapproveReview = asyncHandler(async (req, res) => {
  const { id: productId, reviewId } = req.params;

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  const review = product.reviews.id(reviewId);
  if (!review) {
    return res.status(404).json({ message: "Review not found" });
  }

  review.approved = false; // ✅ Unapprove the review

  await product.save();

  res.json({ message: "Review unapproved successfully", review });
});


export {
  getProducts,
  deleteProduct,
  createProduct,
  updateProduct,
  uploadProducts,
  addToCart,
  getCart,
  deleteCartItem,
  getProductById,
  approveReview,
  getPendingReviews,
  deleteReviewById,
  getProductBySku,
  getProductVariants,
  updateGroupCommonFields,
  addVariantToGroup,
  updateProductGroup,
  getProductFullById,
  getProductsByGroupId,
  getProductGroup,
  updateVariant,
  createProductReview,
  unapproveReview,
};
