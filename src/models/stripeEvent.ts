import { Schema, models, model } from "mongoose";

const stripeEventSchema = new Schema({
  eventId: { type: String, required: true, unique: true },
  type: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  handledAt: { type: Date, default: null },
  error: { type: String, default: "" },
});

stripeEventSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 30 });

export const StripeEvent =
  models.StripeEvent || model("StripeEvent", stripeEventSchema);
