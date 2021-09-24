import mongoose from "mongoose";

interface creditsType {
  user: string;
  credits: number;
  lastDaily: number;
}

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

export default mongoose.model<creditsType>("Credits", creditsSchema, "Credits");
