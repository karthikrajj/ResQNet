const mongoose = require('mongoose');

const DisasterReportSchema = new mongoose.Schema({
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['Flood', 'Landslide', 'Earthquake', 'Fire', 'Cyclone', 'Building Collapse', 'Medical Emergency', 'Other'],
    required: true 
  },
  description: { type: String },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    address: { type: String }
  },
  severity: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
  status: { type: String, enum: ['Verified', 'Unverified', 'Resolved'], default: 'Unverified' },
  images: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('DisasterReport', DisasterReportSchema);
