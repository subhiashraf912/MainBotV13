import mongoose from "mongoose";
const senCooldownsSchema = new mongoose.Schema({
  user: {
    type: String,
    required: false,
    unique: false,
  },
  lastMessage: {
    type: Number,
    required: false,
    unique: false,
  },
});

export default mongoose.model(
  "SenCooldowns",
  senCooldownsSchema,
  "SenCooldowns"
);
