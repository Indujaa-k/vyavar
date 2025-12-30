import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import multer from "multer";
import XLSX from "xlsx";
import Product from "../models/productModel.js";
import ProductGroup from "../models/productgroupModel.js";
import User from "../models/userModel.js";
import reviewnotificatioEmail from "../utils/reviewnotificationEmail.js";

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
  const products = await Product.find(filterCriteria).sort(sortOptions);

  res.json(products);
});

// @desc Fetch single  product
// @route GET /api/products/:id
// @access Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate({
    path: "reviews.user",
    select: "name profilePicture",
  });
  if (product) {
    res.json(product);
  } else {
    // status it's 500 by default cuz of errHandler
    res.status(404);
    throw new Error("Product not found");
  }
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
    product,
    variants,
  });
});

// @desc Add product to cart
// @route POST /api/products/:id/addtocart
// @access Private
const addToCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { qty = 1, size } = req.body; // default qty=1

  if (!size) return res.status(400).json({ message: "Size is required" });
  if (qty < 0) return res.status(400).json({ message: "Invalid quantity" });

  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.cartItems = user.cartItems || [];

  const sizeStock = product.productdetails?.stockBySize?.find(
    (s) => s.size === size
  );

  if (!sizeStock)
    return res.status(400).json({ message: "Size not available" });
  if (sizeStock.stock < qty)
    return res.status(400).json({ message: "Not enough stock available" });

  const existingCartItem = user.cartItems.find(
    (item) =>
      item.product.toString() === product._id.toString() && item.size === size
  );

  if (existingCartItem && qty === 0) {
    user.cartItems = user.cartItems.filter(
      (item) => item._id.toString() !== existingCartItem._id.toString()
    );
  } else if (existingCartItem) {
    existingCartItem.qty += qty; // 🔥 increment
    existingCartItem.price = existingCartItem.qty * product.price;
  } else {
    user.cartItems.push({
      product: product._id,
      qty,
      size,
      price: qty * product.price,
    });
  }

  await user.save();

  const updatedUser = await User.findById(userId).populate("cartItems.product");

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

  res.status(200).json({
    cartItems: user.cartItems,
  });
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
    (item) => item._id.toString() === cartItemId
  );

  if (!cartItem) {
    return res.status(404).json({ message: "Cart item not found" });
  }

  // 🔁 RESTORE STOCK
  const product = await Product.findById(cartItem.product._id);

  if (product) {
    const sizeStock = product.productdetails.stockBySize.find(
      (s) => s.size === cartItem.size
    );

    if (sizeStock) {
      sizeStock.stock += cartItem.qty;
      await product.save();
    }
  }

  // 🗑 REMOVE ITEM
  user.cartItems = user.cartItems.filter(
    (item) => item._id.toString() !== cartItemId
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

    // 🔥 CREATE ONE GROUP ID FOR ALL VARIANTS
    const productGroupId = new mongoose.Types.ObjectId().toString();

    const sizeChart = req.files?.sizeChart?.[0]?.path || "";
    const allImages = req.files?.images || [];

    if (allImages.length !== parsedProducts.length * 3) {
      return res.status(400).json({
        message: "Each color variant must have exactly 3 images",
      });
    }

    let imageIndex = 0;
    const createdProducts = [];

    for (let i = 0; i < parsedProducts.length; i++) {
      const variant = parsedProducts[i];

      const images = allImages
        .slice(imageIndex, imageIndex + 3)
        .map((file) => file.path);

      imageIndex += 3;

      const product = new Product({
        user: req.user._id,
        brandname,
        description,

        // ✅ TAKE PRICE FROM VARIANT
        price: Number(variant.price),
        oldPrice: Number(variant.oldPrice),
        discount: Number(variant.discount),

        images,
        sizeChart,

        productGroupId,

        // ✅ UNIQUE SKU
        SKU: `${SKU}-${variant.color.toUpperCase()}-${Date.now()}`,

        productdetails: variant.productdetails,
        shippingDetails: parsedShippingDetails,
        isFeatured: isFeatured === "true",

        rating: 0,
        numReviews: 0,
      });

      const savedProduct = await product.save();
      createdProducts.push(savedProduct);
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

const storage = multer.memoryStorage();
const upload = multer({ storage }).single("file");

const uploadProducts = asyncHandler(async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: "File upload failed" });
    }

    const file = req.file;

    // ✅ Validate file extension
    if (!file.originalname.match(/\.(xlsx|xls)$/)) {
      return res.status(400).json({ message: "Only Excel files are allowed" });
    }

    // ✅ Read and Parse Excel file
    const workbook = XLSX.read(file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // ✅ Validate and Process Data
    const products = [];

    for (const row of sheetData) {
      if (!row.brandname || !row.productdetails) {
        return res.status(400).json({ message: "Invalid data in Excel file" });
      }

      // ✅ Parse `productdetails`
      let parsedProductDetails;
      try {
        parsedProductDetails =
          typeof row.productdetails === "string"
            ? JSON.parse(row.productdetails) // Parse if it's a JSON string
            : row.productdetails;
      } catch (error) {
        return res
          .status(400)
          .json({ message: "Invalid productdetails format" });
      }

      // ✅ Destructure product details correctly
      const {
        gender,
        category,
        subcategory,
        type,
        ageRange,
        color,
        fabric,
        sizes,
        stockBySize,
      } = parsedProductDetails;
      const oldPrice = parseFloat(row.oldPrice);
      const discount = parseFloat(row.discount);
      const calculatedPrice = oldPrice - (oldPrice * discount) / 100;
      products.push({
        user: req.user._id,
        brandname: row.brandname,
        price: Number(calculatedPrice.toFixed(2)),
        oldPrice: row.oldPrice,
        discount: row.discount,
        description: row.description,
        images: row.images ? row.images.split(",") : [],
        productdetails: {
          gender,
          category,
          subcategory,
          type,
          ageRange,
          color,
          fabric,
          sizes,
          stockBySize,
        },
      });
    }

    // ✅ Insert products into the database
    try {
      await Product.insertMany(products);
      res.status(201).json({ message: "Products uploaded successfully!" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error inserting products into database", error });
    }
  });
});

// @desc Create new Review
// @route PUT /api/products/:id/reviews
// @access Private
const createproductreview = asyncHandler(async (req, res) => {
  console.log("Incoming Review Request:", req.body);
  const { rating, comment } = req.body;

  // ✅ Fetch existing product instead of creating a new one
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );
  if (alreadyReviewed) {
    res.status(400);
    throw new Error("Product already reviewed");
  }

  const review = {
    name: req.user.name,
    rating: Number(rating),
    comment,
    user: req.user._id,
    approved: false,
    profilePicture: req.user.profilePicture,
  };

  product.reviews.push(review);
  product.numReviews = product.reviews.length;
  product.rating =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

  await product.save();

  /* ================= MAIL SECTION ================= */

  try {
    console.log("➡️ Sending admin mail...");

    await reviewnotificatioEmail({
      to: process.env.ADMIN_EMAIL,
      subject: "📝 New Product Review Submitted",
      text: `
Product: ${product.brandname}
Reviewer: ${req.user.name}
Rating: ${rating}
Comment: ${comment}
    `,
    });

    console.log("✅ Admin mail sent");

    console.log("➡️ Fetching sellers...");
    const sellers = await User.find({
      isSeller: true,
      email: { $exists: true, $ne: "" },
    });
    console.log("🧾 SELLERS FOUND COUNT:", sellers.length);

    if (sellers.length === 0) {
      console.log("❌ SELLER NOT FOUND");
    }

    for (const seller of sellers) {
      console.log("📧 Sending mail to seller:", seller.email);

      await reviewnotificatioEmail({
        to: seller.email,
        subject: "📝 New Product Review Submitted",
        text: `
Product: ${product.brandname}
Rating: ${rating}
Comment: ${comment}
      `,
      });
    }

    console.log("✅ Seller mail section completed");
  } catch (err) {
    console.error("❌ MAIL ERROR:", err);
  }

  /* ================= END MAIL ================= */

  // 🔥 SEND RESPONSE ONLY AFTER ALL LOGIC
  res.status(201).json({ message: "Review added & notifications sent" });
});

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
    req.params.reviewId
  );

  const product = await Product.findById(req.params.id);

  if (!product) {
    console.error("❌ ERROR: Product not found");
    return res.status(404).json({ message: "Product not found" });
  }

  const review = product.reviews.find(
    (r) => r._id.toString() === req.params.reviewId
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
      "reviews brandname images"
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
      (r) => r._id.toString() !== reviewId
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
    product,
    variants,
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
    }
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

  const files = req.files;
  if (!color || !sizes || !stockBySize || !files || files.length !== 3) {
    res.status(400);
    throw new Error("Variant fields are missing");
  }

  const images = files.map((file) => file.path);

  const baseProduct = await Product.findOne({ productGroupId: groupId });
  if (!baseProduct) throw new Error("Product group not found");

  const existingVariant = await Product.findOne({
    productGroupId: groupId,
    "productdetails.color": color,
  });
  if (existingVariant)
    throw new Error("Variant with this color already exists");

  const SKU = `${
    baseProduct.SKU.split("-")[0]
  }-${color.toUpperCase()}-${Date.now()}`;

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
      color,
      sizes,
      stockBySize,
      ageRange: baseProduct.productdetails.ageRange,
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
    { new: true }
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

  const products = await Product.find({ productGroupId: groupId });

  if (!products) {
    res.status(404);
    throw new Error("No products found for this group");
  }

  res.json(products); // ✅ Must return JSON
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
  if (req.body.oldPrice !== undefined)
    product.oldPrice = Number(req.body.oldPrice);

  if (req.body.discount !== undefined)
    product.discount = Number(req.body.discount);

  if (req.body.price !== undefined) product.price = Number(req.body.price);

  // variant details
  if (req.body.color) product.productdetails.color = req.body.color;

  if (req.body.sizes) product.productdetails.sizes = req.body.sizes;

  if (req.body.stockBySize)
    product.productdetails.stockBySize = req.body.stockBySize;

  // images (optional replace)
  if (req.files && req.files.length > 0) {
    product.images = req.files.map((f) => f.path);
  }

  const updated = await product.save();
  res.json(updated);
});

export {
  getProducts,
  deleteProduct,
  createProduct,
  updateProduct,
  createproductreview,
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
};
