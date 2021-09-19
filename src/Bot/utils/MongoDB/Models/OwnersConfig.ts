import mongoose from "mongoose";

const guildSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  clientId: { type: String, required: true, unique: true },
});

export default mongoose.model("Owners", guildSchema, "Owners");
