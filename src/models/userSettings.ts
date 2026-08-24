import mongoose, { Schema, Types, models } from "mongoose";

export interface IUserSettings extends Document {
  userId: Types.ObjectId;
  settings: {
    selectedLanguages: { value: string; label: string }[];
    translationType: string;
    uiLocale?: string;
  };
}

const UserSettingsSchema = new Schema({
  userId: { type: String, required: true, unique: true },
  settings: {
    selectedLanguages: [
      {
        value: { type: String },
        label: { type: String },
      },
    ],
    translationType: {
      type: String,
      default: "formal",
    },
    uiLocale: {
      type: String,
      default: "",
    },
  },
});

export const UserSettings =
  models.UserSettings ||
  mongoose.model<IUserSettings>("UserSettings", UserSettingsSchema);
