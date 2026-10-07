import dotenv from "dotenv";
dotenv.config();
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import deliveryRoutes from "./routes/deliveryRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import bannerRoutes from "./routes/bannerRoutes.js";
import subscriptionsRoutes from "./routes/subscriptionRoutes.js";
import offerRoutes from "./routes/offerRoutes.js";
import shippingRoutes from "./routes/shippingRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import enquiryRoutes from "./routes/Enquiryroutes.js";
import trendingCardRoutes from "./routes/trendingCardRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import "./utils/subscriptionCron.js";
import "./utils/razorpayInstance.js";
import showcaseRoutes from "./routes/showcaseRoutes.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); // folder server.js is in

connectDB();
const app = express();

app.use(
  cors({
    origin: [
      "https://new-vyavarclient-3f1f.vercel.app",
      "http://localhost:3000",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.options("*", cors());
app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ limit: "500mb", extended: true }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// ─── API routes ─────────────────────────────────────────────
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/delivery", deliveryRoutes);
app.use("/api/subscriptions", subscriptionsRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api/enquiry", enquiryRoutes);
app.use("/api/shipping", shippingRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/trending-cards", trendingCardRoutes);
app.use("/api", transactionRoutes); // keep this after the specific /api/... routes
app.use("/api/showcases", showcaseRoutes);

app.get("/api/config/paypal", (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID),
);

// ─── Static uploads (images / videos) ───────────────────────
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ─── Error handling (must be LAST) ──────────────────────────
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});