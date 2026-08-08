import { Schema, Document, models, model } from "mongoose";

export interface IUser extends Document {
  email: string;
  name?: string;
  image?: string;
  selectedLanguages: string[];
  translationType: string;
  createdAt: Date;
  emailSummary: boolean;
}

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  image: String,
  selectedLanguages: { type: [String], default: ["english", "spanish"] },
  translationType: { type: String, default: "formal" },
  emailSummary: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export const User = models.User || model<IUser>("User", userSchema);
