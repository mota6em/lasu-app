import mongoose from "mongoose";

interface ITranslation {
  userId: string;
  sourceText: string;
  result: {
    translations: Record<string, string>;
    example?: Record<string, string>;
  };
  translationType: string;
  createdAt: Date;
}

const TranslationSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  sourceText: { type: String, required: true },
  result: {
    type: new mongoose.Schema({
      translations: { type: mongoose.Schema.Types.Mixed, required: true },
      example: { type: mongoose.Schema.Types.Mixed },
    }),
    required: true,
  },
  translationType: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Translation =
  mongoose.models.Translation ||
  mongoose.model<ITranslation>("Translation", TranslationSchema);

export default Translation;
