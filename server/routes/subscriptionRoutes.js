import express from "express";
import {
  createSubscription,
  getSubscriptions,
  updateSubscription,
  toggleSubscriptionStatus,
  getActiveSubscription,
  deleteSubscription,
} from "../controlers/subscriptionController.js";
import {
  createSubscriptionOrder,
  confirmSubscriptionPayment,
} from "../controlers/subscriptionPaymentController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .get(protect, adminOnly, getSubscriptions)
  .post(protect, adminOnly, createSubscription);
router.route("/:id").put(protect, adminOnly, updateSubscription);
router.route("/:id/toggle").put(protect, adminOnly, toggleSubscriptionStatus);
router.delete("/:id", protect, adminOnly, deleteSubscription);


router.post("/order/:id", protect, createSubscriptionOrder);
router.post("/confirm", protect, confirmSubscriptionPayment);

router.get("/active", getActiveSubscription);

export default router;
