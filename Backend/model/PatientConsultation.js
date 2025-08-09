const mongoose = require('mongoose');

const patientconsultationSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  symptoms: { type: String, required: true },
  diagnosis: { type: String, required: true },
  medications: [{
    medicineName: { type: String, required: true },
    dosage: { type: String, required: true },
    frequency: { type: String, required: true },
    duration: { type: String, required: true },
  }],
  notes: { type: String },
  followUpRequired: { type: Boolean, default: false },
  followUpDate: { type: Date },
  previousConsultation: { type: Boolean, default: false },
}, { timestamps: true });

const PatientConsultationModel = mongoose.model('patients-consultations',patientconsultationSchema);
module.exports = PatientConsultationModel;