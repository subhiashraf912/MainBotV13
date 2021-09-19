import mongoose from "mongoose";

const Schema = new mongoose.Schema({
  warns: Array,
  user: String,
  guild: String,
});
export default mongoose.model("wanrs", Schema);
