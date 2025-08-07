const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
  name: String,
  password: String,
  email: String,
  phone:String,
  address:String,
});

const DoctorModel = mongoose.model('doctor', DoctorSchema);

module.exports = DoctorModel;