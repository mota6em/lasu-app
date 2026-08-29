import { Schema, Document, models, model } from "mongoose";

export type SubscriptionStatus =
  | "none"
  | "trialing"
  | "active"
  | "past_due"
  | "unpaid"
  | "paused"
  | "incomplete"
  | "incomplete_expired"
  | "canceled";

export interface ISubscription {
  provider: "stripe";
  customerId?: string;
  subscriptionId?: string;
  status: SubscriptionStatus;
  plan?: "monthly" | "yearly" | "lifetime" | null;
  priceId?: string;
  lifetime: boolean;
  currentPeriodEnd?: Date | null;
  cancelAtPeriodEnd: boolean;
  canceledAt?: Date | null;
  startedAt?: Date | null;
  endedAt?: Date | null;
  latestInvoiceStatus?: string;
  lastPaymentFailedAt?: Date | null;
  welcomedAt?: Date | null;
  syncedEventAt?: number;
  updatedAt?: Date;
}

export interface IUser extends Document {
  email: string;
  name?: string;
  image?: string;
  selectedLanguages: string[];
  translationType: string;
  createdAt: Date;
  emailSummary: boolean;
  tier: "free" | "pro";
  subscription?: ISubscription;
}

const subscriptionSchema = new Schema<ISubscription>(
  {
    provider: { type: String, default: "stripe" },
    customerId: { type: String, default: "" },
    subscriptionId: { type: String, default: "" },
    status: {
      type: String,
      enum: [
        "none",
        "trialing",
        "active",
        "past_due",
        "unpaid",
        "paused",
        "incomplete",
        "incomplete_expired",
        "canceled",
      ],
      default: "none",
    },
    plan: { type: String, enum: ["monthly", "yearly", "lifetime", null], default: null },
    priceId: { type: String, default: "" },
    lifetime: { type: Boolean, default: false },
    currentPeriodEnd: { type: Date, default: null },
    cancelAtPeriodEnd: { type: Boolean, default: false },
    canceledAt: { type: Date, default: null },
    startedAt: { type: Date, default: null },
    endedAt: { type: Date, default: null },
    latestInvoiceStatus: { type: String, default: "" },
    lastPaymentFailedAt: { type: Date, default: null },
    welcomedAt: { type: Date, default: null },
    syncedEventAt: { type: Number, default: 0 },
    updatedAt: { type: Date, default: null },
  },
  { _id: false },
);

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  image: String,
  selectedLanguages: { type: [String], default: ["english", "spanish"] },
  translationType: { type: String, default: "formal" },
  emailSummary: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  tier: { type: String, enum: ["free", "pro"], default: "free" },
  subscription: { type: subscriptionSchema, default: () => ({}) },
});

userSchema.index({ "subscription.customerId": 1 });
userSchema.index({ "subscription.subscriptionId": 1 });

export const User = models.User || model<IUser>("User", userSchema);
