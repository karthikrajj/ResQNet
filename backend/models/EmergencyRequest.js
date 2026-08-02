const mongoose = require('mongoose');

const EmergencyRequestSchema = new mongoose.Schema({
  citizen: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  volunteer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Assigned volunteer
  type: { 
    type: String, 
    enum: ['Rescue', 'Medical', 'Food', 'Water', 'Shelter', 'Other'], 
    required: true 
  },
  description: { type: String },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    address: { type: String }
  },
  status: { 
    type: String, 
    enum: ['Pending', 'Assigned', 'On the Way', 'Rescued', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'High' }
}, { timestamps: true });

module.exports = mongoose.model('EmergencyRequest', EmergencyRequestSchema);
