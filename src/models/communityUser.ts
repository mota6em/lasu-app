import mongoose, { Schema, model, models } from "mongoose";
export const CommunityUserSchema = new Schema({
  userId: { type: String, required: true, unique: true },
  joinedAt: { type: Date, default: Date.now },
  showName: { type: Boolean, default: true },
  showPicture: { type: Boolean, default: true },
  shareTranslations: { type: Boolean, default: true },
  xp: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  topWords: { type: [String], default: [] },
  badges: { type: [String], default: [] },
  lastActive: { type: Date, default: Date.now },
  rank: { type: Number, default: 0 },
  level: { type: Number, default: 0 },
});

const CommunityUser =
  models.CommunityUser || model("CommunityUser", CommunityUserSchema);

export default CommunityUser;
