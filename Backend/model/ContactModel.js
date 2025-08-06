const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: String,
  email: { type: String, required: true },
  phone: String,
  department: { type: String, required: true },
  priority: { type: String, required: true },
  subject: String,
  preferredContact: String,
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const ContactModel = mongoose.model('Contact', ContactSchema);

module.exports = ContactModel;