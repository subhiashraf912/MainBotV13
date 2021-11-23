import mongoose from "mongoose";
import WarnsType from "../../../../../types/WarnsType";

const Schema = new mongoose.Schema({
  warns: Array,
  user: String,
  guild: String,
});
export default mongoose.model<WarnsType>("wanrs", Schema);
