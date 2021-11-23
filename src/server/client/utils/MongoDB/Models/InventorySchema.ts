import mongoose from "mongoose";

interface InventoryType {
  user: string;
  characters: string[];
  food: string[];
}

const InventorySchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
    unique: true,
  },
  characters: {
    type: Array,
    required: false,
    unique: false,
    default: [],
  },
  food: {
    type: Array,
    required: false,
    unique: false,
    default: [],
  },
});

export default mongoose.model<InventoryType>(
  "Inventory",
  InventorySchema,
  "Inventory"
);
