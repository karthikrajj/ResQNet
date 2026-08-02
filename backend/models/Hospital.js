const mongoose = require('mongoose');

const HospitalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  totalBeds: { type: Number, required: true },
  availableBeds: { type: Number, required: true },
  hasAmbulance: { type: Boolean, default: true },
  hasTraumaCenter: { type: Boolean, default: false },
  contactNumber: { type: String },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    address: { type: String }
  }
}, { timestamps: true });

module.exports = mongoose.model('Hospital', HospitalSchema);
