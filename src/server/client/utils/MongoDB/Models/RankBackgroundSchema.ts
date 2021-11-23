import mongoose from "mongoose";

interface profileBanner {
  user: string;
  rankBackground: string | null;
}

const rankBackgroundSchema = new mongoose.Schema({
  user: {
    type: String,
    required: false,
    unique: false,
  },
  rankBackground: {
    type: String,
    required: false,
    unique: false,
    default: null,
  },
});

export default mongoose.model<profileBanner>(
  "RankBackground",
  rankBackgroundSchema,
  "ranksBackgrounds"
);
