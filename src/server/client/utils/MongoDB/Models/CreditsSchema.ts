import mongoose from "mongoose";
import Credits from "../../../../../types/Credits.interface";

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

export default mongoose.model<Credits>("Credits", creditsSchema, "Credits");
