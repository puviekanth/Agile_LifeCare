const mongoose = require('mongoose');

const PrescriptionSchema = new mongoose.Schema({
  email: String,
  prescriptionFilePath: String,
  deliveryMethod: { type: String, enum: ['home', 'instore'] },
  deliveryDetails: {
    address: String,
    city: String,
    state: String,
    zip: String,
  },
  orderToken: String,
  createdAt: { type: Date, default: Date.now },
  verificationStatus: { 
    type: String, 
    enum: ['pending', 'verified', 'failed','manual','completed'], 
    default: 'pending' 
  },
  extractedMedicines: [{
    originalText: String,
    name: String,
    dosage: String,
    frequency: String,
    verified: {
      type: Boolean,
      default: false
    },
    nmraMatch: {
      matched: Boolean,
      matchedRecord: {
        genericname: String,
        brandname: String,
        dosagecode: String
      },
      confidence: Number
    }
  }],
  doctorInfo: {
    name: String,
    license: String,
  },
  patientInfo: {
    name: String,
    age: String
  },
  prescriptionDate: Date,
  verificationNotes: String,
  verifiedAt: Date,
  verifiedBy: String,
  TotalCost:Number,
});

const PrescriptionModel = mongoose.model('prescription', PrescriptionSchema);
module.exports = PrescriptionModel;