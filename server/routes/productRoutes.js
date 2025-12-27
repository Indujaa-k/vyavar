import express from "express";
const router = express.Router();
import {
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
  updateGroupCommonFields,
  addVariantToGroup,
  updateProductGroup,
  getProductFullById,
  getProductsByGroupId,
  markReviewHelpful,
  markReviewNotHelpful ,
} from "../controlers/productControler.js";
import { uploadProductFiles, uploadMultipleImages } from "../multer/multer.js";
import { protect, adminOrSeller } from "../middleware/authMiddleware.js";
import multer from "multer";

// Multer setup for image upload
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/"); // make sure this folder exists
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// --- REVIEW ROUTES ---
// Pending reviews
router.route("/sku/:sku").get(getProductBySku);
router.route("/reviews/pending").get(protect, adminOrSeller, getPendingReviews);

// Delete a review by reviewId
router
  .route("/reviews/:reviewId")
  .delete(protect, adminOrSeller, deleteReviewById);

// Approve a review
router
  .route("/:id/reviews/:reviewId/approve")
  .put(protect, adminOrSeller, approveReview);

// Create a review for a product
router.route("/:id/reviews").post(protect, createproductreview);

//products
router.route("/").get(getProducts);
router
  .route("/create")
  .post(protect, adminOrSeller, uploadProductFiles, createProduct);
router.post("/upload", protect, adminOrSeller, uploadProducts);
router.get("/:id/full", getProductFullById);
router.route("/:id/reviews").post(protect, createproductreview);
router.route("/getcart").get(protect, getCart);
router.route("/:cartItemId/deletecart").delete(protect, deleteCartItem);
router.route("/:id/addtocart").post(protect, addToCart);
router
  .route("/:id")
  .get(getProductById)

  .delete(protect, adminOrSeller, deleteProduct)
  .put(protect, adminOrSeller, uploadProductFiles, updateProduct);

router.put(
  "/group/:groupId/common",
  protect,
  adminOrSeller,
  updateGroupCommonFields
);

router.post(
  "/group/:groupId/variant",
  uploadMultipleImages,
  protect,
  adminOrSeller,
  addVariantToGroup
);

router.put(
  "/group/:groupId/variant",
  protect,
  adminOrSeller,
  updateProductGroup
);
router.get("/group/:groupId", getProductsByGroupId);
// Mark review as Helpful / Not Helpful
router.put(
  "/:productId/reviews/:reviewId/helpful",
  protect,
  markReviewHelpful
);

router.put(
  "/:productId/reviews/:reviewId/not-helpful",
  protect,
  markReviewNotHelpful
);



export default router;
