import express from "express";
import {
  createSubscription,
  deleteSubscription,
  getSubscriptions,
  updateSubscription,
} from "../controlers/subscriptionController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js"; // updated

const router = express.Router();

router
  .route("/")
  .get(protect, adminOnly, getSubscriptions)
  .post(protect, adminOnly, createSubscription);
router
  .route("/:id")
  .delete(protect, adminOnly, deleteSubscription)
  .put(protect, adminOnly, updateSubscription);

export default router;
