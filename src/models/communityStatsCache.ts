import mongoose, { Schema, models } from "mongoose";

const StatItemSchema = new Schema({
  _id: { type: String, required: true },
  count: { type: Number, required: true },
});

const CommunityStatsCacheSchema = new Schema({
  lastUpdated: { type: Date, required: true },

  daily: {
    words: [StatItemSchema],
    languages: [StatItemSchema],
    learners: [StatItemSchema],
  },

  monthly: {
    words: [StatItemSchema],
    languages: [StatItemSchema],
    learners: [StatItemSchema],
  },

  allTime: {
    words: [StatItemSchema],
    languages: [StatItemSchema],
    learners: [StatItemSchema],
  },
});

export const CommunityStatsCache =
  models.CommunityStatsCache ||
  mongoose.model("CommunityStatsCache", CommunityStatsCacheSchema);
