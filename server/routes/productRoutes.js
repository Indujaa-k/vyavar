import express from "express";
const router = express.Router();
import excelUpload from "../middleware/excelUpload.js";
import {
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
  updateGroupCommonFields,
  addVariantToGroup,
  updateProductGroup,
  getProductFullById,
  getProductsByGroupId,
  markReviewHelpful,
  markReviewNotHelpful,
  getProductGroup,
  updateVariant,
  createProductReview,
  unapproveReview,
   getAllReviews
  
} from "../controlers/productControler.js";

import { uploadProductFiles, uploadMultipleImages,uploadReviewImages, } from "../multer/multer.js";
import { protect, adminOrSeller } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";
import optionalAuth from "../middleware/optionalAuthMiddleware.js";
// --- REVIEW ROUTES ---
// Pending reviews
router.route("/sku/:sku").get(optionalAuth,getProductBySku);
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
router.route("/:id/reviews").post(
  protect,
  uploadReviewImages,
createProductReview
);

//products
router.route("/").get(optionalAuth,getProducts);
router
  .route("/create")
  .post(protect, adminOrSeller, uploadProductFiles, createProduct);
router.post(
  "/upload",
  protect,
  adminOrSeller,
  excelUpload.single("file"),
  uploadProducts
);
router.get("/:id/full",optionalAuth, getProductFullById);
router.route("/getcart").get(protect, getCart);
router.route("/:cartItemId/deletecart").delete(protect, deleteCartItem);
router.route("/:id/addtocart").post(protect, addToCart);
router
  .route("/:id")
  .get(optionalAuth,getProductById)

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
  protect,
  adminOrSeller,
  uploadMultipleImages,
  addVariantToGroup
);
router.put(
  "/group/variant/:id",
  uploadMultipleImages,
  protect,
  adminOrSeller,
  updateVariant
);
router.put(
  "/group/:groupId/variant",
  protect,
  adminOrSeller,
  updateProductGroup
);
router.get("/group/:groupId", optionalAuth,getProductsByGroupId);
// Mark review as Helpful / Not Helpful
router.put("/:productId/reviews/:reviewId/helpful", protect, markReviewHelpful);
router.get("/group/comman/:groupId", protect, adminOrSeller, getProductGroup);
router.put(
  "/:productId/reviews/:reviewId/not-helpful",
  protect,
  markReviewNotHelpful
);
router
  .route("/:id/reviews/:reviewId/unapprove")
  .put(protect, adminOrSeller, unapproveReview);
  router.get(
  "/reviews/all",
  protect,
  adminOrSeller,
  getAllReviews
);


export default router;
      