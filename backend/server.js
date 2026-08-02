require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Routes
const authRoutes = require('./routes/authRoutes');
const citizenRoutes = require('./routes/citizenRoutes');
const volunteerRoutes = require('./routes/volunteerRoutes');
const adminRoutes = require('./routes/adminRoutes');
const seedDatabase = require('./scripts/seed');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: '*', // Allow all origins for Vercel deployment compatibility
  credentials: true
}));
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/citizen', citizenRoutes);
app.use('/api/volunteer', volunteerRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => res.status(200).json({ status: 'OK' }));

// Global MongoDB connection instance for Serverless reuse
let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log('Using existing MongoDB connection');
    return;
  }

  const mongoUri = process.env.MONGO_URI;
  
  if (!mongoUri) {
    console.warn('WARNING: MONGO_URI environment variable is missing.');
    console.warn('Falling back to localhost MongoDB. This will fail on Vercel!');
  }

  try {
    const db = await mongoose.connect(mongoUri || 'mongodb://localhost:27017/resqnet');
    isConnected = db.connections[0].readyState;
    console.log('MongoDB successfully connected');
    
    // Auto-seed if required
    if (process.env.SEED_DB === 'true') {
      await seedDatabase();
    }
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};

// If running locally as a standalone server
if (require.main === module) {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });
}

// Export for Vercel Serverless Function
module.exports = async (req, res) => {
  await connectDB();
  return app(req, res);
};
