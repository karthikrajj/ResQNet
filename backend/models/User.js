const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['Citizen', 'Volunteer', 'Admin', 'NGO', 'Hospital'], 
    default: 'Citizen' 
  },
  phone: { type: String },
  address: { type: String },
  isApproved: { 
    type: Boolean, 
    default: function() {
      // Admin and Citizen are auto-approved, others need admin approval
      return this.role === 'Admin' || this.role === 'Citizen';
    } 
  },
  isAvailable: { type: Boolean, default: true }, // For Volunteers
  location: {
    lat: { type: Number },
    lng: { type: Number }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
