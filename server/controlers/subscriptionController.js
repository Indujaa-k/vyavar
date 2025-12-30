import asyncHandler from "express-async-handler";
import Subscription from "../models/subscriptionModel.js";

const getSubscriptions = asyncHandler(async (req, res) => {
  const subscriptions = await Subscription.find({}).sort({ createdAt: -1 });
  res.json(subscriptions);
});

// Create new subscription
// POST /api/subscriptions
// Access: Admin
// @desc    Create new subscription
// @route   POST /api/subscriptions
// @access  Admin
// Create new subscription
const createSubscription = asyncHandler(async (req, res) => {
  const {
    planName,
    planType,
    price,
    discountPercent,
    startDate,
    durationInDays,
  } = req.body;

  // Check if a subscription already exists
  const existing = await Subscription.findOne({});
  if (existing) {
    res.status(400);
    throw new Error(
      "Only one subscription can exist at a time. Delete the existing subscription to create a new one."
    );
  }

  if (!planName || !planType || !price || !startDate || !durationInDays) {
    res.status(400);
    throw new Error("Please provide all required fields");
  }

  // Calculate end date
  const start = new Date(startDate);
  const endDate = new Date(
    start.setDate(start.getDate() + parseInt(durationInDays))
  );

  const subscription = await Subscription.create({
    planName,
    planType,
    price,
    discountPercent,
    startDate,
    endDate,
    durationInDays,
  });

  res.status(201).json(subscription);
});

// DELETE SUBSCRIPTION
// DELETE /api/subscriptions/:id
// Admin only
const deleteSubscription = asyncHandler(async (req, res) => {
  const subscription = await Subscription.findById(req.params.id);

  if (!subscription) {
    res.status(404);
    throw new Error("Subscription not found");
  }

  await Subscription.findByIdAndDelete(req.params.id);

  res.json({ message: "Subscription deleted successfully" });
});



// Update subscription
const updateSubscription = asyncHandler(async (req, res) => {
  const subscription = await Subscription.findById(req.params.id);
  if (!subscription) {
    res.status(404);
    throw new Error("Subscription not found");
  }

  const {
    planName,
    planType,
    price,
    discountPercent,
    startDate,
    durationInDays,
  } = req.body;

  if (planName) subscription.planName = planName;
  if (planType) subscription.planType = planType;
  if (price) subscription.price = price;
  if (discountPercent !== undefined)
    subscription.discountPercent = discountPercent;
  if (startDate) subscription.startDate = startDate;
  if (durationInDays) {
    subscription.durationInDays = durationInDays;
    const start = new Date(startDate || subscription.startDate);
    subscription.endDate = new Date(
      start.setDate(start.getDate() + parseInt(durationInDays))
    );
  }

  const updated = await subscription.save();
  res.json(updated);
});

export { createSubscription, deleteSubscription, updateSubscription,getSubscriptions };
