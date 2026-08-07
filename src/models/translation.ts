import mongoose from "mongoose";

interface ITranslation {
  userId: string;
  sourceText: string;
  result: {
    translations: Record<string, string>;
    example?: Record<string, string>;
    exampleMeaning?: Record<string, string>;
    romanization?: Record<string, string>;
    sourceLanguage?: string;
    meaning?: string;
    partOfSpeech?: string;
    difficulty?: string;
    note?: string;
    synonyms?: string[];
  };
  translationType: string;
  translationFilter: "word" | "phrase";
  createdAt: Date;
}

const ResultSchema = new mongoose.Schema(
  {
    translations: { type: mongoose.Schema.Types.Mixed, required: true },
    example: { type: mongoose.Schema.Types.Mixed },
    exampleMeaning: { type: mongoose.Schema.Types.Mixed },
    romanization: { type: mongoose.Schema.Types.Mixed },
    sourceLanguage: { type: String },
    meaning: { type: String },
    partOfSpeech: { type: String },
    difficulty: { type: String },
    note: { type: String },
    synonyms: { type: [String], default: undefined },
  },
  { _id: false }
);

const TranslationSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  sourceText: { type: String, required: true },
  result: { type: ResultSchema, required: true },
  translationType: { type: String, required: true },
  translationFilter: { type: String, enum: ["word", "phrase"] },
  createdAt: { type: Date, default: Date.now },
});

TranslationSchema.index({ userId: 1, createdAt: -1 });

//Set translation filter automatically
TranslationSchema.pre("save", function (next) {
  if (this.sourceText.includes(" ")) this.translationFilter = "phrase";
  else this.translationFilter = "word";
  next();
});

const Translation =
  mongoose.models.Translation ||
  mongoose.model<ITranslation>("Translation", TranslationSchema);

export default Translation;
