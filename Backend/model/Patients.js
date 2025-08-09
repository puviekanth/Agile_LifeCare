const mongoose = require('mongoose');

// Updated Patient Schema
const PatientSchema = new mongoose.Schema({
  name: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    fullName: { type: String, required: true },
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
  phone: { type: String, required: true },
  dateOfBirth: Date,
  age: Number,
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  medicalHistory: {
    bloodType: String,
    allergies: [String],
    currentMedications: [String],
    previousConsultation: { type: Boolean, default: false },
    consultationHistory: [{
      date: Date,
      symptoms: String,
      diagnosis: String,
      medications: [{
        medicineName: String,
        dosage: String,
        frequency: String,
        duration: String,
      }],
      notes: String,
      followUpRequired: Boolean,
      followUpDate: Date,
    }],
  },
  lastUpdated: Date,
});

const PaitentModel = mongoose.model('patient', PatientSchema);

module.exports = PaitentModel;