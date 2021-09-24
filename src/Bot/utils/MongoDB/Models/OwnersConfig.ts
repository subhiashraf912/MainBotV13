import mongoose from "mongoose";
interface Owners {
  userId: string;
  clientId: string;
}
const guildSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  clientId: { type: String, required: true, unique: true },
});

export default mongoose.model<Owners>("Owners", guildSchema, "Owners");
