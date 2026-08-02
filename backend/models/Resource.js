const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Food Kits', 'Water Bottles', 'Medicines', 'Blankets', 'Rescue Boats', 'Ambulances', 'Other'],
    required: true 
  },
  quantity: { type: Number, required: true },
  location: { type: String }, // Warehouse or distribution center
  status: { type: String, enum: ['Available', 'Low Stock', 'Out of Stock'], default: 'Available' }
}, { timestamps: true });

module.exports = mongoose.model('Resource', ResourceSchema);
