import mongoose from "mongoose";
const creditsSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
    unique: true,
  },
  credits: {
    type: Number,
    required: true,
    unique: false,
  },
  lastDaily: {
    type: Number,
    required: true,
    unique: false,
  },
});

export default mongoose.model("Credits", creditsSchema, "Credits");
