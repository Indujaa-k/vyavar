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
} from "../controlers/productControler.js";
import { uploadProductFiles } from "../multer/multer.js";
import { protect, adminOrSeller } from "../middleware/authMiddleware.js";


// --- REVIEW ROUTES ---
// Pending reviews
router.route("/reviews/pending").get(protect, adminOrSeller, getPendingReviews);

// Delete a review by reviewId
router.route("/reviews/:reviewId").delete(protect, adminOrSeller, deleteReviewById);

// Approve a review
router.route("/:id/reviews/:reviewId/approve").put(protect, adminOrSeller, approveReview);

// Create a review for a product
router.route("/:id/reviews").post(protect, createproductreview);


//products
router.route("/").get(getProducts);
router
  .route("/create")
  .post(protect, adminOrSeller, uploadProductFiles, createProduct);
router.post("/upload", protect, adminOrSeller, uploadProducts);
router.route("/:id/reviews").post(protect, createproductreview);
router.route("/getcart").get(protect, getCart);
router.route("/:cartItemId/deletecart").delete(protect, deleteCartItem);
router.route("/:id/addtocart").post(protect, addToCart);
router
  .route("/:id")
  .get(getProductById)
  .delete(protect, adminOrSeller, deleteProduct)
  .put(protect, adminOrSeller, uploadProductFiles, updateProduct);

export default router;
