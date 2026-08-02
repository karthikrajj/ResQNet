const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Shelter = require('../models/Shelter');
const Hospital = require('../models/Hospital');
const Resource = require('../models/Resource');

const seedDatabase = async () => {
  try {
    const adminExists = await User.findOne({ email: 'admin@resqnet.com' });
    
    if (adminExists) {
      console.log('Database already seeded');
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('password123', salt);

    // Create Users
    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@resqnet.com',
      password,
      role: 'Admin',
      phone: '1234567890',
      address: 'Central Command Center'
    });

    const volunteer = await User.create({
      name: 'John Doe (Volunteer)',
      email: 'volunteer@resqnet.com',
      password,
      role: 'Volunteer',
      phone: '0987654321',
      isApproved: true,
      location: { lat: 37.7749, lng: -122.4194 }
    });

    const citizen = await User.create({
      name: 'Jane Smith (Citizen)',
      email: 'citizen@resqnet.com',
      password,
      role: 'Citizen',
      phone: '1112223333',
      location: { lat: 37.7749, lng: -122.4194 }
    });

    // Create Shelters
    await Shelter.create([
      {
        name: 'City Community Center',
        capacity: 500,
        currentOccupancy: 120,
        foodAvailable: true,
        medicalSupport: true,
        contactNumber: '555-0101',
        location: { lat: 37.7750, lng: -122.4180, address: '100 Main St' }
      },
      {
        name: 'Westside High School',
        capacity: 1000,
        currentOccupancy: 850,
        foodAvailable: true,
        medicalSupport: false,
        contactNumber: '555-0102',
        location: { lat: 37.7800, lng: -122.4200, address: '250 West Ave' }
      }
    ]);

    // Create Hospitals
    await Hospital.create([
      {
        name: 'General Memorial Hospital',
        totalBeds: 200,
        availableBeds: 45,
        hasAmbulance: true,
        hasTraumaCenter: true,
        contactNumber: '555-0201',
        location: { lat: 37.7710, lng: -122.4250, address: '500 Health Blvd' }
      },
      {
        name: 'City Care Clinic',
        totalBeds: 50,
        availableBeds: 5,
        hasAmbulance: false,
        hasTraumaCenter: false,
        contactNumber: '555-0202',
        location: { lat: 37.7690, lng: -122.4100, address: '120 Clinic Rd' }
      }
    ]);

    // Create Resources
    await Resource.create([
      { name: 'Standard Food Kit', category: 'Food Kits', quantity: 500, location: 'Central Warehouse' },
      { name: 'Drinking Water 1L', category: 'Water Bottles', quantity: 2000, location: 'Central Warehouse' },
      { name: 'First Aid Kits', category: 'Medicines', quantity: 150, location: 'Central Warehouse' },
      { name: 'Thermal Blankets', category: 'Blankets', quantity: 400, location: 'Westside Depot' }
    ]);

    console.log('Database seeded successfully with dummy data!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

module.exports = seedDatabase;
