const mongoose = require('mongoose');

const ShelterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  capacity: { type: Number, required: true },
  currentOccupancy: { type: Number, default: 0 },
  foodAvailable: { type: Boolean, default: true },
  medicalSupport: { type: Boolean, default: false },
  contactNumber: { type: String },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    address: { type: String }
  },
  status: { type: String, enum: ['Open', 'Full', 'Closed'], default: 'Open' }
}, { timestamps: true });

module.exports = mongoose.model('Shelter', ShelterSchema);
