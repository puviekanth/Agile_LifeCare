const mongoose = require('mongoose');

const consultationSchema = new mongoose.Schema({
  user: {
    name: {
      type: String,
      required: [true, 'User name is required'],
      trim: true,
      minlength: [2, 'User name must be at least 2 characters long'],
      maxlength: [100, 'User name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address']
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^\d{10}$/, 'Phone number must be a 10-digit number']
    }
  },
  patient: {
    name: {
      type: String,
      required: [true, 'Patient name is required'],
      trim: true,
      minlength: [2, 'Patient name must be at least 2 characters long'],
      maxlength: [100, 'Patient name cannot exceed 100 characters']
    },
    age: {
      type: Number,
      required: [true, 'Patient age is required'],
      min: [0, 'Age cannot be negative'],
      max: [120, 'Age cannot exceed 120']
    },
    gender: {
      type: String,
      required: [true, 'Patient gender is required'],
      enum: {
        values: ['Male', 'Female', 'Other'],
        message: 'Gender must be Male, Female, or Other'
      }
    },
    reason: {
      type: String,
      required: [true, 'Reason for consultation is required'],
      trim: true,
      minlength: [10, 'Reason must be at least 10 characters long'],
      maxlength: [500, 'Reason cannot exceed 500 characters']
    }
  },
  medicalRecords: {
    type: String,
    required: [true, 'Medical records file path is required'],
    trim: true
  },
  location: {
    lat: {
      type: Number,
      required: [true, 'Latitude is required'],
      min: [-90, 'Latitude must be between -90 and 90'],
      max: [90, 'Latitude must be between -90 and 90']
    },
    lng: {
      type: Number,
      required: [true, 'Longitude is required'],
      min: [-180, 'Longitude must be between -180 and 180'],
      max: [180, 'Longitude must be between -180 and 180']
    },
    link: {
      type: String,
      required: [true, 'Google Maps link is required'],
      trim: true,
      match: [/^https:\/\/maps\.google\.com\/\?q=-?\d+\.\d+,-?\d+\.\d+$/, 'Invalid Google Maps link format']
    }
  },
  slot: {
    date: {
      type: Date,
      required: [true, 'Consultation date is required'],
      min: [new Date(), 'Date cannot be in the past']
    },
    time: {
      type: String,
      required: [true, 'Time slot is required'],
      enum: {
        values: [
          '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
          '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
        ],
        message: 'Invalid time slot'
      }
    }
  },
  status: {
    type: String,
    enum: {
      values: ['Pending', 'Confirmed', 'Cancelled'],
      message: 'Status must be Pending, Confirmed, or Cancelled'
    },
    default: 'Pending'
  },
  // New verification fields
  verificationStatus: {
    type: Boolean,
    default: false
  },
  verificationToken: {
    type: String,
    required: false,
    unique: true
  },
  verificationTokenExpires: {
    type: Date,
    required: false
  },
  verifiedAt: {
    type: Date
  },
  createdBy: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for verification token
consultationSchema.index({ verificationToken: 1 });
consultationSchema.index({ verificationTokenExpires: 1 });

const ConsultationModel = mongoose.model('Consultation', consultationSchema);
module.exports = ConsultationModel;