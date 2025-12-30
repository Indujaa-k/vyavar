import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Subscription from "../models/subscriptionModel.js";

export const createSubscriptionPayment = asyncHandler(async (req, res) => {
  const { subscriptionId } = req.body;

  const user = await User.findById(req.user._id);
  const subscription = await Subscription.findById(subscriptionId);

  if (!subscription) {
    res.status(404);
    throw new Error("Subscription not found");
  }

  // 🔥 IMPORTANT CHECK
  if (user.isSubscribed) {
    res.status(400);
    throw new Error("User already has an active subscription");
  }

  // 🧮 Final price after discount
  const discount = subscription.discountPercent || 0;
  const finalPrice =
    subscription.price - (subscription.price * discount) / 100;

  // ⬇️ TEMP (replace with Razorpay / Stripe)
  res.json({
    success: true,
    amount: finalPrice,
    subscriptionId: subscription._id,
  });
});

export const confirmSubscriptionPayment = asyncHandler(async (req, res) => {
  const { subscriptionId, paymentId } = req.body;

  const user = await User.findById(req.user._id);
  const subscription = await Subscription.findById(subscriptionId);

  if (!subscription) {
    res.status(404);
    throw new Error("Subscription not found");
  }

  // ⛔ Extra safety
  if (user.isSubscribed) {
    res.status(400);
    throw new Error("Already subscribed");
  }

  const startDate = new Date();
  const endDate = new Date();

  if (subscription.planType === "MONTHLY") {
    endDate.setMonth(endDate.getMonth() + 1);
  } else {
    endDate.setFullYear(endDate.getFullYear() + 1);
  }

  // ✅ ACTIVATE SUBSCRIPTION
  user.isSubscribed = true;
  user.subscription = {
    subscriptionId: subscription._id,
    planName: subscription.planName,
    isActive: true,
    discountPercent: subscription.discountPercent,
    startDate,
    endDate,
  };

  await user.save();

  res.json({
    success: true,
    message: "Subscription activated successfully",
  });
});
