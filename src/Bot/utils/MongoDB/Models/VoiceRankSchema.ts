import mongoose from "mongoose";
import VoiceRankType from "../../types/VoiceRankType";

const voiceRankSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  user: {
    type: String,
    required: false,
    unique: false,
  },
  server: {
    type: String,
    required: false,
    unique: false,
  },

  joinTime: {
    type: Number,
    required: false,
    unique: false,
  },
  voiceTime: {
    type: Number,
    required: false,
    unique: false,
  },
});

export default mongoose.model<VoiceRankType>(
  "VoiceRank",
  voiceRankSchema,
  "VoiceRank"
);
