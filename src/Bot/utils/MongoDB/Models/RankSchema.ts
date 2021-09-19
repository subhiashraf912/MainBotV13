import mongoose from "mongoose";
const rankSchema = new mongoose.Schema({
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

  level: {
    type: Number,
    required: false,
    unique: false,
  },
  xp: {
    type: Number,
    required: false,
    unique: false,
  },
  lastMessage: {
    type: Number,
    required: false,
    unique: false,
  },
});

export default mongoose.model("Rank", rankSchema, "ranks");
