import asyncHandler from "express-async-handler";
import multer from "multer";
import XLSX from "xlsx";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";

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
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    // status it's 500 by default cuz of errHandler
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc Add product to cart
// @route POST /api/products/:id/addtocart
// @access Private
const addToCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const qty = Number(req.body.qty);
  const size = req.body.size;
  if (!size) {
    return res.status(400).json({ message: "Size is required" });
  }

  if (qty < 0) {
    return res.status(400).json({ message: "Invalid quantity" });
  }

  const product = await Product.findById(req.params.id);
  const user = await User.findById(userId);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  user.cartItems = user.cartItems || [];

  // 🔍 Find size stock
  const sizeStock = product.productdetails.stockBySize.find(
    (s) => s.size === size
  );

  if (!sizeStock) {
    return res.status(400).json({ message: "Size not available" });
  }

  // ✅ ONLY CHECK STOCK (DO NOT MODIFY)

  // 🔍 Find existing cart item
  const existingCartItem = user.cartItems.find(
    (item) =>
      item.product.toString() === product._id.toString() && item.size === size
  );

  // 🗑 If qty = 0 → remove item
  if (existingCartItem && qty === 0) {
    user.cartItems = user.cartItems.filter(
      (item) => item._id.toString() !== existingCartItem._id.toString()
    );

    await user.save();

    const updatedUser = await User.findById(userId).populate(
      "cartItems.product"
    );
    return res.status(200).json(updatedUser.cartItems);
  }
  if (sizeStock.stock < qty) {
    return res.status(400).json({ message: "Not enough stock" });
  }
  // ➕ Update or Add cart item
  if (existingCartItem) {
    existingCartItem.qty = qty;
    existingCartItem.price = qty * product.price;
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
  res.status(200).json(updatedUser.cartItems);
});

// @desc get cart product
// @route get /api/products/getcart
// @access Private
const getCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  res.status(200).json(user.cartItems);
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

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // 🔍 Check cart item exists
  const cartItemExists = user.cartItems.some(
    (item) => item._id.toString() === cartItemId
  );

  if (!cartItemExists) {
    return res.status(404).json({ message: "Cart item not found" });
  }

  // 🗑 Remove cart item ONLY (NO STOCK LOGIC)
  user.cartItems = user.cartItems.filter(
    (item) => item._id.toString() !== cartItemId
  );

  await user.save();

  const updatedUser = await User.findById(userId).populate("cartItems.product");
  res.status(200).json(updatedUser.cartItems);
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
  const {
    brandname,
    price,
    description,
    productdetails,
    discount,
    oldPrice,
    SKU,
    shippingDetails,
    isFeatured,
  } = req.body;
  if (!req.files || (!req.files["images"] && !req.files["sizeChart"])) {
    res.status(400).json({ message: "No files uploaded" });
    return;
  }
  const images = req.files["images"]?.map((file) => file.path) || [];
  const sizeChart = req.files["sizeChart"]?.[0]?.path || "";

  //  console.log("📄 Uploaded sizeChart:", sizeChart);

  const parsedProductDetails =
    typeof productdetails === "string"
      ? JSON.parse(productdetails)
      : productdetails;
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
  // Ensure sizes is an array (in case it's sent as a string)
  const formattedSizes = Array.isArray(sizes) ? sizes : sizes.split(",");

  const parsedShippingDetails =
    typeof shippingDetails === "string"
      ? JSON.parse(shippingDetails)
      : shippingDetails;
  const completeShippingDetails = {
    weight: parsedShippingDetails.weight,
    dimensions: {
      length: parsedShippingDetails.dimensions.length,
      width: parsedShippingDetails.dimensions.width,
      height: parsedShippingDetails.dimensions.height,
    },
    originAddress: {
      street1: parsedShippingDetails.originAddress.street1,
      street2: parsedShippingDetails.originAddress.street2,
      city: parsedShippingDetails.originAddress.city,
      state: parsedShippingDetails.originAddress.state,
      zip: parsedShippingDetails.originAddress.zip,
      country: parsedShippingDetails.originAddress.country,
    },
  };

  // Extract fields from productdetails
  const product = new Product({
    brandname,
    price,
    oldPrice,
    discount,
    description,
    user: req.user._id,
    images,
    sizeChart,
    SKU,
    productdetails: {
      gender,
      category,
      subcategory,
      type,
      ageRange,
      color,
      fabric,
      sizes: formattedSizes,
      stockBySize,
    },
    shippingDetails: completeShippingDetails,
    numReviews: 0,
    isFeatured,
  });
  console.log("product details", product);
  const createProduct = await product.save();
  res.status(201).json(createProduct);
});

// @desc Update a product
// @route PUT /api/products/:id
// @access Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  try {
    const {
      brandname,
      price,
      productdetails,
      description,
      oldPrice,
      discount,
      SKU,
      shippingDetails,
      isFeatured,
    } = req.body;

    console.log("Received request body:", req.body);

    let parsedProductDetails = {};
    if (productdetails) {
      try {
        parsedProductDetails =
          typeof productdetails === "string"
            ? JSON.parse(productdetails)
            : productdetails;
      } catch (error) {
        console.error("Error parsing product details:", error);
        return res
          .status(400)
          .json({ message: "Invalid product details format" });
      }
    }
    const parsedShippingDetails =
      typeof shippingDetails === "string"
        ? JSON.parse(shippingDetails)
        : shippingDetails;
    const completeShippingDetails = {
      weight: parsedShippingDetails.weight,
      dimensions: {
        length: parsedShippingDetails.dimensions.length,
        width: parsedShippingDetails.dimensions.width,
        height: parsedShippingDetails.dimensions.height,
      },
      originAddress: {
        street1: parsedShippingDetails.originAddress.street1,
        street2: parsedShippingDetails.originAddress.street2,
        city: parsedShippingDetails.originAddress.city,
        state: parsedShippingDetails.originAddress.state,
        zip: parsedShippingDetails.originAddress.zip,
        country: parsedShippingDetails.originAddress.country,
      },
    };
    const {
      gender = "",
      category = "",
      subcategory = "",
      type = "",
      ageRange = "",
      color = "",
      fabric = "",
      sizes = [],
      stockBySize = [],
    } = parsedProductDetails;
    // Ensure sizes is an array (fixes the `.split is not a function` error)
    const formattedSizes =
      typeof sizes === "string" ? sizes.split(",").map((s) => s.trim()) : sizes;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.brandname = brandname;
      product.price = price;
      product.description = description;
      product.productdetails = {
        gender,
        category,
        subcategory,
        type,
        ageRange,
        color,
        fabric,
        sizes: formattedSizes,
        stockBySize,
      };
      product.shippingDetails = completeShippingDetails;
      product.SKU = SKU;
      product.isFeatured = isFeatured;
      product.oldPrice = oldPrice;
      product.discount = discount;

      // Handle file updates
      if (req.files) {
        // Update images if new ones are uploaded
        if (req.files["images"]) {
          product.images = req.files["images"].map((file) => file.path);
        }

        // Update size chart if new PDF is uploaded
        if (req.files["sizeChart"]) {
          product.sizeChart = req.files["sizeChart"][0].path;
        }
      }

      const updatedProduct = await product.save();
      console.log("Updated product:", updatedProduct);
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Server error. Could not update product" });
  }
});

// @desc Create a bulk product
// @route Post /api/products
// @access Private/Admin

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
const getPendingReviews = async (req, res) => {
  try {
    // Find all products that have reviews with approved: false
    const productsWithPendingReviews = await Product.find({
      "reviews.approved": false,
    })
      .populate("user", "name email") // Populate product owner info
      .populate("reviews.user", "name email") // Populate reviewer info
      .select("brandname SKU images reviews");

    // Extract only the pending reviews from each product
    const pendingReviews = [];

    productsWithPendingReviews.forEach((product) => {
      const pending = product.reviews.filter((review) => !review.approved);

      pending.forEach((review) => {
        pendingReviews.push({
          reviewId: review._id,
          productId: product._id,
          productName: product.brandname,
          productSKU: product.SKU,
          productImage:
            product.images && product.images.length > 0
              ? product.images[0]
              : "", // Single image
          reviewerName: review.name,
          reviewerUser: review.user,
          rating: review.rating,
          comment: review.comment,
          createdAt: review.createdAt,
        });
      });
    });

    // Sort by creation date (newest first)
    pendingReviews.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.status(200).json({
      success: true,
      count: pendingReviews.length,
      data: pendingReviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching pending reviews",
      error: error.message,
    });
  }
};

// Get pending reviews with pagination
const getPendingReviewsPaginated = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const productsWithPendingReviews = await Product.find({
      "reviews.approved": false,
    })
      .populate("user", "name email")
      .populate("reviews.user", "name email")
      .select("brandname SKU images reviews");

    const pendingReviews = [];

    productsWithPendingReviews.forEach((product) => {
      const pending = product.reviews.filter((review) => !review.approved);

      pending.forEach((review) => {
        pendingReviews.push({
          reviewId: review._id,
          productId: product._id,
          productName: product.brandname,
          productSKU: product.SKU,
          productImage:
            product.images && product.images.length > 0
              ? product.images[0]
              : "", // Single image
          reviewerName: review.name,
          reviewerUser: review.user,
          rating: review.rating,
          comment: review.comment,
          createdAt: review.createdAt,
        });
      });
    });

    // Sort by creation date (newest first)
    pendingReviews.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    // Apply pagination
    const paginatedReviews = pendingReviews.slice(skip, skip + limit);
    const totalPages = Math.ceil(pendingReviews.length / limit);

    res.status(200).json({
      success: true,
      count: paginatedReviews.length,
      total: pendingReviews.length,
      page,
      totalPages,
      data: paginatedReviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching pending reviews",
      error: error.message,
    });
  }
};

// Delete a review
const deleteReview = async (req, res) => {
  try {
    const { productId, reviewId } = req.params;

    // Find the product
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Find the review index
    const reviewIndex = product.reviews.findIndex(
      (review) => review._id.toString() === reviewId
    );

    if (reviewIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // Remove the review
    product.reviews.splice(reviewIndex, 1);

    // Recalculate rating and numReviews
    if (product.reviews.length > 0) {
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((acc, review) => acc + review.rating, 0) /
        product.reviews.length;
    } else {
      product.numReviews = 0;
      product.rating = 0;
    }

    await product.save();

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
      data: {
        productId: product._id,
        numReviews: product.numReviews,
        rating: product.rating,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting review",
      error: error.message,
    });
  }
};

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
  getPendingReviewsPaginated,
  deleteReviewById,
};
