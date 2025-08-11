// models/Consultation.js
const mongoose = require('mongoose');

const consultationSchema = new mongoose.Schema({
  user:{
    name:String,
    phone:String,
    email:String
  },
  patient:{
    name:String,
    age:String,
    gender:String,
    reason:String,
  },
  medicalRecords:String,
  location:{
    lat:String,
    lng:String,
    link:String,
  },
  slot:{
    date:Date,
    time:String,
  },
  status:{type:String,enum:['Pending','Confirmed']},
  verificationToken:String,
  verificationTokenExpires:Date,
  verificationStatus:{type:Boolean,default:false},
  verifiedAt:{type:Date,required:false},
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