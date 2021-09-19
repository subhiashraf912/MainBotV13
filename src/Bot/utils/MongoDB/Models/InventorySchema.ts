import mongoose from 'mongoose';
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

export default mongoose.model('Inventory', InventorySchema, 'Inventory');
