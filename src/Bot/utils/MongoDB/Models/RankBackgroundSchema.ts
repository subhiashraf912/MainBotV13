import mongoose from "mongoose";
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

export default mongoose.model(
  "RankBackground",
  rankBackgroundSchema,
  "ranksBackgrounds"
);
