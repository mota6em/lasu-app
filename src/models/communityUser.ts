import mongoose, { Schema, model, models } from "mongoose";
export const CommunityUserSchema = new Schema({
  userId: { type: String, required: true, unique: true },
  joinedAt: { type: Date, default: Date.now },
  name: { type: String },
  showName: { type: Boolean, default: true },
  image: { type: String },
  showPicture: { type: Boolean, default: true },
  shareTranslations: { type: Boolean, default: true },
  xp: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  topWords: { type: [String], default: [] },
  badges: { type: [String], default: [] },
  lastActive: { type: Date, default: Date.now },
  rank: { type: Number, default: 0 },
  level: { type: Number, default: 0 },
  dailyTranslations: { type: Number, default: 0 },
  monthlyTranslations: { type: Number, default: 0 },
  allTimeTranslations: { type: Number, default: 0 },
});

const CommunityUser =
  models.CommunityUser || model("CommunityUser", CommunityUserSchema);

export default CommunityUser;
