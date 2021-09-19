import mongoose from "mongoose";
const birthdaysSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  user: {
    type: String,
    required: false,
    unique: false,
  },
  birthday: {
    type: String,
    required: false,
    unique: false,
  },
});

export default mongoose.model("birthdays", birthdaysSchema, "birthdays");
