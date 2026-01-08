import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";
import Offer from "../models/OfferModel.js";
import BillingInvoice from "../models/billingInvoiceModel.js";
import sendEmail from "../utils/sendEmail.js";
import Razorpay from "razorpay";
import crypto from "crypto";

// @desc Create new order
// @route POST /api/orders
// @access Private
const addorderitems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    taxPrice,
    shippingPrice,
    totalPrice,
    couponCode,
    paymentResult,
  } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
  }

  const isCOD = paymentMethod === "COD";

  const order = new Order({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod,
    taxPrice,
    shippingPrice,
    totalPrice,
    couponCode,

    isPaid: !isCOD,
    paidAt: !isCOD ? Date.now() : null,
    orderStatus: isCOD ? "ORDERED" : "CONFIRMED",

    paymentResult: isCOD
      ? {
          id: "COD-" + Date.now(),
          status: "Pending (Cash on Delivery)",
          update_time: new Date().toISOString(),
          email_address: req.user.email,
        }
      : paymentResult,
  });

  const createdOrder = await order.save();

  // Clear user's cart
  await User.findByIdAndUpdate(req.user._id, {
    $set: { cartItems: [] },
  });

  // Update coupon usage
  if (couponCode) {
    const offer = await Offer.findOne({ code: couponCode.toUpperCase() });

    if (offer) {
      offer.usedCount = (offer.usedCount || 0) + 1;

      if (!offer.usedBy.includes(req.user._id)) {
        offer.usedBy.push(req.user._id);
      }

      await offer.save();
    }
  }

  res.status(201).json(createdOrder);
});

// @desc get order by id
// @route GET /api/orders/:id
// @access Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name email")
    .populate({
      path: "orderItems.product",
      select: "name images", // Include the fields you need
    });
  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error("Order Not found");
  }
});
// @desc update order to paid
// @route update /api/orders/:id/pay
// @access Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };

    // ✅ Add this line: set orderStatus to CONFIRMED if it was not set yet
    if (!order.orderStatus || order.orderStatus === "ORDERED") {
      order.orderStatus = "CONFIRMED";
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order Not found");
  }
});

// @desc update order to delivered
// @route update /api/orders/:id/deliver
// @access Private
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.orderStatus = "DELIVERED";
    order.deliveredAt = Date.now();
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order Not found");
  }
});
// @desc get logged in user orders
// @route GET /api/orders/myorders
// @access Private
const GetMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate({
    path: "orderItems.product", // Reference to the Product model
    select: "images brandname rating ", // Select only the fields you need
  });
  res.json(orders);
});

// @desc get orders
// @route GET /api/admin/orders
// @access Private/admin
const GetOrders = asyncHandler(async (req, res) => {
  const { status } = req.query; // Get status filter from query params

  let filter = {};
  if (status && status !== "all") {
    filter.orderStatus = status;
  }

  const orders = await Order.find(filter).populate("user", "id name").populate({
    path: "orderItems.product",
    select: "brandname images",
  });

  res.json(orders);
});

//@desc Get orders for delivery person
//@route GET/Api/orders/delivery
// access Private Delivery
const getOrdersForDeliveryPerson = asyncHandler(async (req, res) => {
  const orders = await Order.find({
    deliveryPerson: req.user._id,
    orderStatus: "OUT_FOR_DELIVERY",
  }).populate("user", "name email");
  res.json(orders);
});

//@desc Accept order
// @route PUT/api/orders/delivery/accept/:id
// access Private Delivery
const acceptOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order && order.orderStatus === "PACKED") {
    order.orderStatus = "OUT_FOR_DELIVERY";
    await order.save();
    try {
      await sendEmail({
        email: order.user.email,
        status: "Shipped",
        orderId: order._id,
      });
      console.log("✅ Shipment email sent");
    } catch (error) {
      console.error("❌ Error sending shipment email:", error.message);
    }
    res.json({ message: "Order accepted" });
  } else {
    res.status(400);
    throw new Error("Order cannot be accepted");
  }
});

// @desc Reject order
//@route PUT/api/orders/delivery/reject/:id
// access Private Delivery
const rejectOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order && order.isPacked && !order.isAcceptedByDelivery) {
    order.deliveryPerson = null; // Remove delivery person assignment
    await order.save();
    res.json({ message: "Order rejected" });
  } else {
    res.status(400);
    throw new Error("Order cannot be rejected");
  }
});

// @desc Mark order as completed
// @route PUT/api/orders/delivery/complete/:id
// access Private Delivery
const markOrderAsCompleted = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order && order.orderStatus === "OUT_FOR_DELIVERY") {
    order.orderStatus = "DELIVERED";
    order.deliveredAt = Date.now();

    if (order.paymentMethod === "COD") {
      order.isPaid = true;
      order.paidAt = Date.now();
    }

    await order.save();
    try {
      await sendEmail({
        email: order.user.email,
        status: "Delivered",
        orderId: order._id,
      });
      console.log("✅ Delivery email sent");
    } catch (error) {
      console.error("❌ Error sending delivery email:", error.message);
    }

    res.json({ message: "Order marked as completed" });
  } else {
    res.status(400);
    throw new Error("Order cannot be marked as completed");
  }
});

// @desc Mark order as returned
// @route PUT/api/orders/delivery/return/:id
// access Private Delivery
const markOrderAsReturned = asyncHandler(async (req, res) => {
  const { returnReason } = req.body;
  const order = await Order.findById(req.params.id);
  if (order && order.isDelivered) {
    order.isReturned = true;
    order.returnReason = returnReason;
    await order.save();
    res.json({ message: "Order marked as returned" });
  } else {
    res.status(400);
    throw new Error("Order cannot be marked as returned");
  }
});

// @desc get undelivered orders in admin
// @route GET/api/orders/undelivered
// access Private Admin

const getUndeliveredOrders = asyncHandler(async (req, res) => {
  try {
    console.log("🚀 [getUndeliveredOrders] Triggered");

    const totalOrders = await Order.countDocuments();
    console.log("📦 Total Orders:", totalOrders);

    const orders = await Order.find({
      orderStatus: { $ne: "DELIVERED" },
    })
      .populate("user", "name email")
      .populate("orderItems.product", "brandname images price");

    console.log("📬 Undelivered Orders Found:", orders.length);
    if (orders.length > 0) {
      console.log("🧾 Sample Order:", {
        id: orders[0]._id,
        user: orders[0].user?.name,
        product: orders[0].orderItems[0]?.product?.brandname,
      });
    }

    res.json(orders);
  } catch (error) {
    console.error("❌ Error inside getUndeliveredOrders:", error.message);
    res.status(500).json({ message: error.message });
  }
});

// @desc Assign order to delivery person
// @route PUT/api/orders/:id/assign
// access Private Admin
const assignOrderToDeliveryPerson = asyncHandler(async (req, res) => {
  const { deliveryPersonId } = req.body;
  const order = await Order.findById(req.params.id)
    .populate("user", "name email profilePicture")
    .populate("deliveryPerson", "name profilePicture")
    .populate("orderItems.product", "name image");
  if (order) {
    order.deliveryPerson = deliveryPersonId;
    order.orderStatus = "PACKED";
    await order.save();
    res.json({ message: "Order assigned to delivery person" });
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});
// @desc    Generate Invoice
// @route   GET /api/orders/:id/invoice
// @access  Private/Admin
const generateInvoice = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (order) {
    const invoice = {
      orderId: order._id,
      user: {
        name: order.user?.name || "N/A",
        email: order.user?.email || "N/A",
      },
      orderItems: order.orderItems,
      shippingAddress: order.shippingAddress,
      paymentMethod: order.paymentMethod,
      taxPrice: order.taxPrice,
      shippingPrice: order.shippingPrice,
      totalPrice: order.totalPrice,
      isPaid: order.isPaid,
      paidAt: order.paidAt,
      isDelivered: order.isDelivered,
      deliveredAt: order.deliveredAt,
      createdAt: order.createdAt,
    };
    order.invoiceDetails = invoice;
    await order.save();
    res.json(invoice);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});
// @desc  getlocations
// @route   GET /api/incomebycity
// @access  Private/Admin
const incomebycity = asyncHandler(async (req, res) => {
  const orders = await Order.find({ isPaid: true });

  // Calculate total income
  const totalIncome = orders.reduce((acc, order) => acc + order.totalPrice, 0);

  // Format total income
  const formattedTotalIncome = `Rs.${totalIncome}`;

  // Calculate income by city
  const incomeByCity = orders.reduce((acc, order) => {
    const city = order.shippingAddress.city || "Unknown"; // Handle missing city
    acc[city] = (acc[city] || 0) + order.totalPrice;
    return acc;
  }, {});
  res.setHeader("Cache-Control", "no-store");
  res.json({
    totalIncome: formattedTotalIncome,
    incomeByCity: Object.entries(incomeByCity).map(([city, income]) => ({
      city,
      income: `Rs. ${income}`, // Format as $k
    })),
  });
});
// @desc    Fetch transaction details with filters
// @route   GET /api/orders/transactions
// @access  Private/Admin
const getTransactions = asyncHandler(async (req, res) => {
  let { startDate, endDate, paymentType, status } = req.query;

  let query = {};

  if (startDate && endDate) {
    query.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  if (paymentType) {
    query.paymentMethod = paymentType;
  }

  if (status) {
    if (status === "Paid") {
      query.isPaid = true;
    } else if (status === "Unpaid") {
      query.isPaid = false;
    } else if (status === "Delivered") {
      query.isDelivered = true;
    }
  }

  const transactions = await Order.find(query).select(
    "createdAt paymentMethod isPaid isDelivered totalPrice taxPrice shippingPrice orderItems"
  );

  res.json(transactions);
});

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// CREATE ORDER
const createRazorpayOrder = async (req, res) => {
  try {
    const { couponCode, shippingPrice } = req.body;

    const user = await User.findById(req.user._id);

    if (!user || user.cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let subtotal = 0;

    for (const item of user.cartItems) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(400).json({ message: "Product not found" });
      }

      subtotal += product.price * item.qty;
    }

    const taxAmount = (subtotal * 5) / 100;
    const shippingAmount = Number(shippingPrice || 0);

    // 🎟️ Coupon snapshot
    let couponSnapshot = null;
    let discountAmount = 0;

    if (couponCode) {
      const offer = await Offer.findOne({
        code: couponCode.toUpperCase(),
        isActive: true,
      });

      if (!offer) {
        return res.status(400).json({ message: "Invalid coupon" });
      }

      if (offer.expiryDate && offer.expiryDate < new Date()) {
        return res.status(400).json({ message: "Coupon expired" });
      }

      discountAmount = Math.round((subtotal * offer.offerPercentage) / 100);

      couponSnapshot = {
        code: offer.code,
        percentage: offer.offerPercentage,
        discountAmount,
      };
    }

    const finalAmount = subtotal + taxAmount + shippingAmount - discountAmount;

    if (finalAmount < 1) {
      return res.status(400).json({ message: "Final amount too low" });
    }

    const roundedFinalAmount = Math.round(finalAmount * 100) / 100;

    // 💳 Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(roundedFinalAmount * 100),
      currency: "INR",
      receipt: `order_${Date.now()}`,
    });

    res.json({
      id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,

      // ✅ send breakdown to frontend
      priceBreakdown: {
        subtotal,
        taxAmount,
        shippingAmount,
        discountAmount,
        total: roundedFinalAmount,
      },

      // ✅ coupon snapshot
      coupon: couponSnapshot,
    });
  } catch (err) {
    console.error("❌ Razorpay error:", err);
    res.status(500).json({ message: "Razorpay order failed" });
  }
};

// VERIFY PAYMENT
// VERIFY PAYMENT
const verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (expectedSign === razorpay_signature) {
      res.json({
        success: true,
        message: "Payment verified successfully",
        paymentId: razorpay_payment_id,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }
  } catch (error) {
    console.error("❌ Verify Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Stripe payments
// @route   post /api/orders/stripe
// @access  public/users
const StripePayment = asyncHandler(async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ error: "Amount is required" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: "usd",
      payment_method_types: ["card"],
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Stripe Payment Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// @desc    update Trackingststatus
// @route   put /api/orders/:id/updatestatus
// @access  private/admin
export const updateOrderStatus = async (req, res) => {
  const { status } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  // 🔥 THIS IS THE KEY LINE
  order.orderStatus = status;

  await order.save();

  res.json({
    message: "Order status updated",
    orderStatus: order.orderStatus,
  });
};

// @desc   Get order statuses count
// @route  GET /api/orders/status-count
// @access Admin
const getOrderStatusCounts = asyncHandler(async (req, res) => {
  const confirmed = await Order.countDocuments({
    orderStatus: "CONFIRMED",
  });

  const packed = await Order.countDocuments({
    orderStatus: "PACKED",
  });

  const outForDelivery = await Order.countDocuments({
    orderStatus: "OUT_FOR_DELIVERY",
  });

  const allOrders = confirmed + packed + outForDelivery;

  res.json({
    allOrders,
    confirmed,
    packed,
    outForDelivery,
  });
});

// @desc create billing invoice to an order
// @route   POST /api/orders/billinginvoice
// @access  Private/Admin
const createBillingInvoice = asyncHandler(async (req, res) => {
  console.log("Incoming Billing Invoice Request Body:", req.body);

  const { logo, from, to, invoiceNumber, date, items, notes, signature } =
    req.body;
  // Calculate totals based on items
  const subtotal = items.reduce((sum, item) => sum + item.rate * item.qty, 0);
  const cgstTotal = items.reduce(
    (sum, item) => sum + ((item.cgst || 0) / 100) * item.rate * item.qty,
    0
  );
  const sgstTotal = items.reduce(
    (sum, item) => sum + ((item.sgst || 0) / 100) * item.rate * item.qty,
    0
  );
  const total = subtotal + cgstTotal + sgstTotal;
  const invoice = new BillingInvoice({
    logo,
    from,
    to,
    invoiceNumber,
    date,
    items,
    subtotal,
    cgstTotal,
    sgstTotal,
    total,
    notes,
    signature,
  });

  const createdInvoice = await invoice.save();

  res.status(201).json({
    message: "Billing invoice created successfully",
    invoice: createdInvoice,
  });
});

// @desc    GET billing invoice to an order
// @route   GET /api/:invoiceNumber
// @access  Private/Admin
const getBillingInvoiceByNumber = asyncHandler(async (req, res) => {
  const invoice = await BillingInvoice.findOne({
    invoiceNumber: req.params.invoiceNumber,
  });

  if (!invoice) {
    res.status(404);
    throw new Error("Invoice not found");
  }

  res.json(invoice);
});
const getIncomeByPincode = asyncHandler(async (req, res) => {
  const data = await Order.aggregate([
    {
      $match: {
        "shippingAddress.pin": { $ne: null },
        isPaid: true,
      },
    },
    {
      $group: {
        _id: "$shippingAddress.pin",
        income: { $sum: "$totalPrice" },
      },
    },
    {
      $project: {
        _id: 0,
        pinCode: "$_id",
        income: 1,
      },
    },
    {
      $sort: { income: -1 },
    },
  ]);

  res.status(200).json(data);
});

export {
  addorderitems,
  getOrderById,
  updateOrderToPaid,
  GetMyOrders,
  GetOrders,
  updateOrderToDelivered,
  getUndeliveredOrders,
  getOrdersForDeliveryPerson,
  acceptOrder,
  rejectOrder,
  markOrderAsCompleted,
  markOrderAsReturned,
  assignOrderToDeliveryPerson,
  generateInvoice,
  incomebycity,
  getTransactions,
  StripePayment,
  getOrderStatusCounts,
  createBillingInvoice,
  getBillingInvoiceByNumber,
  createRazorpayOrder,
  verifyRazorpayPayment,
  getIncomeByPincode,
};
