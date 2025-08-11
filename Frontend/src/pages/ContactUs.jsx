import React, { useState } from "react";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaUsers,
  FaShieldAlt,
  FaStar,
  FaHeartbeat,
} from "react-icons/fa";
import { motion } from "framer-motion";
import EHeader from "../components/EHeader";

const departments = [
  "Medical Consultation",
  "Pharmacy Services",
  "Technical Support",
  "Billing & Insurance",
  "General Inquiry",
];

const priorities = ["Low Priority", "Medium Priority", "High Priority", "Urgent"];

const contactMethods = ["Email", "Phone Call", "Text Message", "Any Method"];

const api = import.meta.env.VITE_API;

const ContactUs = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    department: "",
    priority: "",
    subject: "",
    preferredContact: "",
    message: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${api}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Message sent successfully!");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          department: "",
          priority: "",
          subject: "",
          preferredContact: "",
          message: "",
        });
      } else {
        alert("Failed to send message.");
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);
      alert("An error occurred while submitting the form.");
    }
  };

  return (
    <>
    <EHeader />
    <div className="bg-gradient-to-r from-blue-500 to-green-500 text-white py-16 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <motion.h1
          className="text-4xl font-bold mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Get in Touch
        </motion.h1>
        <p className="text-lg mb-8">
          We’re here to help you with all your healthcare needs.
        </p>
        <div className="flex justify-center gap-10 text-center text-sm font-medium">
          <div>24/7 Support Available</div>
          <div>2 Min Average Response</div>
          <div>50K+ Happy Patients</div>
        </div>
      </div>

      <div className="bg-white text-gray-800 mt-12 rounded-lg shadow-lg max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
        {/* Form */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-2xl font-semibold mb-4">Send us a Message</h2>
          <form
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            onSubmit={handleSubmit}
          >
            <input
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="input"
              placeholder="First Name *"
              required
            />
            <input
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="input"
              placeholder="Last Name *"
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input"
              placeholder="Email Address *"
              required
            />
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="input"
              placeholder="Phone Number"
            />

            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="input"
              required
            >
              <option value="">Select Department *</option>
              {departments.map((dept) => (
                <option key={dept}>{dept}</option>
              ))}
            </select>

            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="input"
              required
            >
              <option value="">Select Priority *</option>
              {priorities.map((level) => (
                <option key={level}>{level}</option>
              ))}
            </select>

            <input
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="input col-span-2"
              placeholder="Subject *"
              required
            />

            <select
              name="preferredContact"
              value={formData.preferredContact}
              onChange={handleChange}
              className="input col-span-2"
              required
            >
              <option value="">Preferred Contact Method *</option>
              {contactMethods.map((method) => (
                <option key={method}>{method}</option>
              ))}
            </select>

            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="input col-span-2 h-28 resize-none"
              placeholder="Message *"
              required
            />

            <button
              type="submit"
              className="col-span-2 bg-gradient-to-r from-blue-600 to-green-600 hover:opacity-90 text-white py-2 rounded font-semibold transition"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Contact Info */}
        <div className="space-y-4 text-sm">
          <div className="flex items-start gap-3 bg-gray-50 p-4 rounded shadow">
            <FaPhoneAlt className="mt-1 text-blue-500" />
            <div>
              <p className="font-bold">Phone Support</p>
              <p>
                +1 (555) 123-4567
                <br />
                +1 (555) 123-4568
              </p>
              <span className="text-blue-600">24/7 Emergency Line</span>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-gray-50 p-4 rounded shadow">
            <FaEnvelope className="mt-1 text-blue-500" />
            <div>
              <p className="font-bold">Email Support</p>
              <p>
                support@lifecare.com
                <br />
                medical@lifecare.com
              </p>
              <span className="text-blue-600">Response within 2 hours</span>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-gray-50 p-4 rounded shadow">
            <FaMapMarkerAlt className="mt-1 text-blue-500" />
            <div>
              <p className="font-bold">Visit Our Clinic</p>
              <p>123 Health Street, Medical District, City 12345</p>
              <span className="text-blue-600">Open 7 days a week</span>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-gray-50 p-4 rounded shadow">
            <FaClock className="mt-1 text-blue-500" />
            <div>
              <p className="font-bold">Business Hours</p>
              <p>
                Mon–Fri: 8 AM – 10 PM
                <br />
                Sat–Sun: 9 AM – 8 PM
              </p>
              <span className="text-blue-600">Emergency services 24/7</span>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-red-100 p-4 rounded shadow">
            <FaHeartbeat className="mt-1 text-red-500" />
            <div>
              <p className="font-bold text-red-600">Emergency Hotline</p>
              <p className="text-red-600 text-lg font-bold">911</p>
              <p className="text-xs">For life-threatening emergencies</p>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose */}
      <div className="max-w-6xl mx-auto mt-16">
        <div className="bg-gradient-to-r from-blue-500 to-green-500 text-white p-8 rounded-lg flex flex-wrap gap-6 justify-around text-center text-sm">
          <div>
            <FaUsers size={30} className="mx-auto mb-2" /> Expert Team
          </div>
          <div>
            <FaShieldAlt size={30} className="mx-auto mb-2" /> Secure & Private
          </div>
          <div>
            <FaClock size={30} className="mx-auto mb-2" /> 24/7 Support
          </div>
          <div>
            <FaStar size={30} className="mx-auto mb-2" /> 5-Star Rated
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-6xl mx-auto bg-white mt-12 p-8 rounded-lg shadow space-y-4 text-gray-800">
        <h2 className="text-xl font-semibold">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-bold">How quickly will I receive a response?</p>
            <p>
              Typically within 2 hours during business hours and 24 hours on
              weekends.
            </p>
          </div>
          <div>
            <p className="font-bold">Is my information secure?</p>
            <p>
              Yes, we use industry-standard encryption and are fully HIPAA
              compliant.
            </p>
          </div>
          <div>
            <p className="font-bold">Can I schedule a consultation?</p>
            <p>
              Select \"Medical Consultation\" as your department, and we’ll help
              schedule one.
            </p>
          </div>
          <div>
            <p className="font-bold">Do you offer emergency services?</p>
            <p>
              Call 911 for life-threatening emergencies. For urgent needs, use
              our hotline.
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default ContactUs;