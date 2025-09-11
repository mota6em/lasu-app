import mongoose, { Schema, model, models } from "mongoose";

const LiveTranslationSchema = new Schema(
  {
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    userImage: { type: String, required: true },
    sourceText: { type: String, required: true },
    translationType: { type: String, required: true },
    result: {
      translations: { type: Map, of: String },
      example: { type: Map, of: String },
    },
  },
  { timestamps: true }
);

const LiveTranslation =
  models.LiveTranslation || model("LiveTranslation", LiveTranslationSchema);

export default LiveTranslation;
