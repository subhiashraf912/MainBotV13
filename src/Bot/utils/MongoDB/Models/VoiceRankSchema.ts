import mongoose from "mongoose";

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

export default mongoose.model("VoiceRank", voiceRankSchema, "VoiceRank");
