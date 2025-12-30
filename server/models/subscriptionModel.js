import mongoose from "mongoose";

const subscriptionSchema = mongoose.Schema(
  {
    planName: {
      type: String,
      required: true, // e.g. BASIC, PRO, PREMIUM
    },

    planType: {
      type: String,
      enum: ["MONTHLY", "YEARLY"],
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },

    discountPercent: {
      type: Number,
      required: true,
      min: 0,
      max: 50, // subscription discount cap
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },
    durationInDays: {
      type: Number, // optional, for reference
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Subscription", subscriptionSchema);
