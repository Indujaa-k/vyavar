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
} from "../controlers/productControler.js";
import { uploadProductFiles } from "../multer/multer.js";
import { protect, adminOrSeller } from "../middleware/authMiddleware.js";

router.route("/").get(getProducts);
router.route("/create").post(protect, adminOrSeller, uploadProductFiles, createProduct);
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
router.route("/reviews/pending").get(protect, adminOrSeller, getPendingReviews);
router
  .route("/:id/reviews/:reviewId/approve")
  .put(protect, adminOrSeller, approveReview);
export default router;
