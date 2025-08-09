// models/Consultation.js
const mongoose = require('mongoose');

const consultationSchema = new mongoose.Schema({
  consultationId: {
    type: String,
    unique: true,
    required: true
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  appointmentDetails: {
    scheduledDate: {
      type: Date,
      required: true
    },
    scheduledTime: {
      type: String,
      required: true
    },
    duration: {
      type: Number, // in minutes
      default: 30
    },
    type: {
      type: String,
      enum: ['Initial', 'Follow-up', 'Emergency'],
      default: 'Initial'
    }
  },
  location: {
    lat: Number,
    lng: Number,
    address: String,
    link: String
  },
  status: {
    type: String,
    enum: ['Scheduled', 'Confirmed', 'In-Progress', 'Completed', 'Cancelled', 'No-Show'],
    default: 'Scheduled'
  },
  consultationNotes: {
    chiefComplaint: String,
    symptoms: String,
    diagnosis: String,
    treatmentPlan: String,
    doctorNotes: String
  },
  fees: {
    consultationFee: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: 'LKR'
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Refunded'],
      default: 'Pending'
    }
  },
  completedAt: Date,
  cancelledAt: Date,
  cancellationReason: String
}, { timestamps: true });

// Generate consultation ID before saving
consultationSchema.pre('save', async function(next) {
  if (!this.consultationId) {
    const count = await this.constructor.countDocuments();
    this.consultationId = `CONS${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

const Consultation = mongoose.model('Consultation', consultationSchema);
module.exports = Consultation;