import mongoose, { Schema, models } from "mongoose";

const StatItemSchema = new Schema(
  {
    _id: { type: String, required: true },
    count: { type: Number, required: true },
  },
  {
    _id: false,
  }
);

const LearnerSchema = new Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    image: { type: String },
    xp: { type: Number, default: 0 },
    showName: { type: Boolean, default: true },
    showPicture: { type: Boolean, default: true },
    totalTranslations: { type: Number, default: 0 },
  },
  { _id: false }
);

const CommunityStatsCacheSchema = new Schema({
  lastUpdated: { type: Date, required: true },

  daily: {
    words: [StatItemSchema],
    languages: [StatItemSchema],
    learners: [LearnerSchema],
  },

  monthly: {
    words: [StatItemSchema],
    languages: [StatItemSchema],
    learners: [LearnerSchema],
  },

  allTime: {
    words: [StatItemSchema],
    languages: [StatItemSchema],
    learners: [LearnerSchema],
  },
});

export const CommunityStatsCache =
  models.CommunityStatsCache ||
  mongoose.model("CommunityStatsCache", CommunityStatsCacheSchema);
