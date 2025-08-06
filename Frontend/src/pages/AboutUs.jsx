import React from 'react';
import {
  FaHeart,
  FaStethoscope,
  FaPrescriptionBottleAlt,
  FaHeartbeat,
  FaLaptopMedical,
  FaUserMd,
  FaShieldAlt,
  FaCheckCircle,
  FaAward,
  FaStar,
  FaLock,
  FaRocket,
  FaCrown,
} from 'react-icons/fa';
import { motion } from 'framer-motion';

const AboutUs = () => {
  return (
    <div className="font-sans text-gray-800">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-500 to-green-500 text-white py-16 text-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <FaHeart className="text-5xl mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">About LifeCare</h1>
          <p className="text-lg max-w-3xl mx-auto">
            Dedicated to revolutionizing healthcare through compassionate care, innovative technology, and unwavering commitment to your wellbeing.
          </p>
          <div className="flex flex-wrap justify-center gap-8 mt-6 text-lg">
            <div>50,000+ Patients Served</div>
            <div>15+ Years Experience</div>
            <div>24/7 Support Available</div>
            <div>98% Patient Satisfaction</div>
          </div>
        </motion.div>
      </div>

      {/* Our Story */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center mb-8">Our Story</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h3 className="text-xl font-semibold mb-4">From Vision to Reality</h3>
            <p className="text-sm">
              Started in 2009, LifeCare has grown into a leading healthcare platform focused on accessible, personalized care. We fuse technology with compassion to ensure everyone receives world-class treatment.
            </p>
            <div className="mt-4 text-sm text-gray-600">
              <p><strong>Founded:</strong> 2009</p>
              <p><strong>Founders:</strong> Sarah Johnson, James Wilton</p>
            </div>
          </div>
          <div className="rounded-lg h-48 bg-gray-100 flex items-center justify-center shadow-md">
            <span className="text-sm text-gray-500">15+ Years of Excellence</span>
          </div>
        </div>
      </section>

      {/* Foundation */}
      <section className="bg-gray-50 py-16 px-4">
        <h2 className="text-2xl font-bold text-center mb-8">Our Foundation</h2>
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6 text-center">
          <div className="p-6 bg-white rounded shadow">
            <FaStethoscope className="text-3xl text-blue-500 mx-auto mb-3" />
            <h3 className="font-semibold">Our Mission</h3>
            <p className="text-sm">Empower lives with accessible, compassionate care and long-term patient relationships.</p>
          </div>
          <div className="p-6 bg-white rounded shadow">
            <FaRocket className="text-3xl text-green-500 mx-auto mb-3" />
            <h3 className="font-semibold">Our Vision</h3>
            <p className="text-sm">Become the most trusted platform globally where healthcare is a right, not a privilege.</p>
          </div>
          <div className="p-6 bg-white rounded shadow">
            <FaStar className="text-3xl text-purple-500 mx-auto mb-3" />
            <h3 className="font-semibold">Our Impact</h3>
            <p className="text-sm">Transformed over 350,000 lives through accessible, tech-driven healthcare services.</p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center mb-8">Our Core Values</h2>
        <div className="grid md:grid-cols-4 gap-4 text-center text-sm">
          <div className="p-4 border rounded shadow">
            <FaHeart className="text-2xl text-pink-500 mx-auto mb-2" />
            <h4 className="font-semibold">Compassionate Care</h4>
            <p>Empathy, respect, and personalized attention for every patient.</p>
          </div>
          <div className="p-4 border rounded shadow">
            <FaLock className="text-2xl text-blue-500 mx-auto mb-2" />
            <h4 className="font-semibold">Trust & Security</h4>
            <p>HIPAA-compliant and privacy-first platform for all your health data.</p>
          </div>
          <div className="p-4 border rounded shadow">
            <FaLaptopMedical className="text-2xl text-indigo-500 mx-auto mb-2" />
            <h4 className="font-semibold">Innovation</h4>
            <p>Next-gen technology powers our smart and efficient care services.</p>
          </div>
          <div className="p-4 border rounded shadow">
            <FaCrown className="text-2xl text-yellow-500 mx-auto mb-2" />
            <h4 className="font-semibold">Excellence</h4>
            <p>Striving for excellence in service delivery, research, and healing.</p>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-gray-50 py-16 px-4">
        <h2 className="text-2xl font-bold text-center mb-8">Meet Our Leadership Team</h2>
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 lg:grid-cols-5 gap-6 text-center">
          {[
            ['Dr. Sarah Johnson', 'Chief Medical Officer', '15+ years experience'],
            ['Dr. Michael Chon', 'Head of Cardiology', '20+ years experience'],
            ['Dr. Emily Rodriguez', 'Pharmacy Director', '10+ years experience'],
            ['James Wilton', 'Chief Technology Officer', '8+ years experience'],
            ['Robert Lee', 'Chief Operations Officer', '12+ years experience'],
          ].map(([name, role, exp]) => (
            <div key={name} className="bg-white p-4 rounded shadow">
              <div className="h-24 bg-gray-100 rounded mb-4"></div>
              <h4 className="font-semibold">{name}</h4>
              <p className="text-sm text-gray-600">{role}</p>
              <p className="text-xs text-gray-500">{exp}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center mb-8">Our Services</h2>
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4 text-center text-sm">
          {[
            ['Medical Consultations', FaUserMd],
            ['Prescription Management', FaPrescriptionBottleAlt],
            ['Health Monitoring', FaHeartbeat],
            ['Telemedicine', FaLaptopMedical],
            ['Mental Wellness', FaHeart],
          ].map(([label, Icon]) => (
            <div key={label} className="p-4 border rounded shadow">
              <Icon className="text-xl text-blue-500 mx-auto mb-2" />
              <p className="font-semibold">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Certifications */}
      <section className="bg-gradient-to-r from-blue-500 to-green-500 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto text-center grid grid-cols-2 sm:grid-cols-4 gap-6">
          <div><FaShieldAlt size={24} className="mx-auto mb-2" /> HIPAA Compliant</div>
          <div><FaCheckCircle size={24} className="mx-auto mb-2" /> ISO 27001 Certified</div>
          <div><FaAward size={24} className="mx-auto mb-2" /> FDA Approved</div>
          <div><FaStar size={24} className="mx-auto mb-2" /> Joint Commission</div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center mb-8">What Our Patients Say</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          {[
            ['Maria Garcia', '“LifeCare has transformed how I manage my health. The compassion and care quality are exceptional.”'],
            ['Robert Thompson', '“The medical team is incredibly knowledgeable and caring. I feel confident in their treatment.”'],
            ['Jennifer Lee', '“24/7 support has been a lifesaver. Knowing help is always available gives me peace of mind.”'],
          ].map(([name, text]) => (
            <div key={name} className="bg-white p-4 rounded shadow">
              <p className="italic">{text}</p>
              <p className="mt-2 font-semibold">– {name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-100 text-center py-12 px-4">
        <FaHeart className="text-3xl text-pink-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Ready to Experience Better Healthcare?</h2>
        <p className="text-sm mb-6 max-w-xl mx-auto">Join thousands of satisfied patients who have chosen LifeCare for their healthcare needs. Your journey to better health starts here.</p>
        <div className="flex justify-center gap-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Get Started Today</button>
          <button className="bg-white border border-blue-600 text-blue-600 px-4 py-2 rounded hover:bg-blue-50 transition">Contact Our Team</button>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;