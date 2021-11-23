import mongoose from "mongoose";
interface rolePlay {
  FirstMember: string;
  SecMember: string;
  times: number;
  Type: string;
}
const RolePlaySchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  FirstMember: {
    type: String,
    required: false,
    unique: false,
  },
  SecMember: {
    type: String,
    required: false,
    unique: false,
  },
  times: {
    type: Number,
    required: false,
    unique: false,
  },
  Type: {
    type: String,
    required: true,
    unique: false,
  },
});

export default mongoose.model<rolePlay>("Roleplay", RolePlaySchema, "rolePlay");
