import mongoose from "mongoose";

const guildLocksSchema = new mongoose.Schema({
  guildId: { type: String, required: true, unique: true },
  settings: { required: true, unique: false },
});

export default mongoose.model("GuildLocks", guildLocksSchema, "guildLocks");
