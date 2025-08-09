import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, 
  Plus, 
  User, 
  Phone, 
  Calendar, 
  FileText, 
  Pill, 
  Clock, 
  X,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  UserPlus,
  AlertCircle,
  MapPin
} from 'lucide-react';
import axios from 'axios';
import debounce from 'lodash/debounce';

const PatientHistoryInterface = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [error, setError] = useState(null);
  const [expandedConsultations, setExpandedConsultations] = useState({});

  const api = 'http://localhost:3000';
  const token = localStorage.getItem('token') || 'your-jwt-token-here'; // Basic token management

  const calculateAge = (dob) => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const debouncedFetchPatients = useCallback(
    debounce(async (term) => {
      setLoading(true);
      try {
        const response = await axios.get(`${api}/api/patients`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          params: { search: term }
        });
        setPatients(response.data.patients);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load patients');
        setLoading(false);
      }
    }, 500),
    [token]
  );

  useEffect(() => {
    debouncedFetchPatients(searchTerm);
  }, [searchTerm, debouncedFetchPatients]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const PatientCard = ({ patient }) => (
    <div 
      className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-100"
      onClick={() => setSelectedPatient(patient)}
      role="button"
      aria-label={`View details for ${patient.name.fullName}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-gray-900">{patient.name.fullName}</h3>
            <p className="text-sm text-gray-500">{patient.age} years • {patient.gender}</p>
          </div>
        </div>
        <ChevronLeft className="w-5 h-5 text-gray-400 transform rotate-180" />
      </div>
      <div className="mt-4 flex items-center justify-between text-sm">
        <div className="flex items-center space-x-2 text-gray-600">
          <Phone className="w-4 h-4" />
          <span>{patient.phone}</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-600">
          <FileText className="w-4 h-4" />
          <span>{patient.medicalHistory?.consultationHistory?.length || 0} consultations</span>
        </div>
      </div>
    </div>
  );

  const AddPatientForm = () => {
    const [formData, setFormData] = useState({
      name: { firstName: '', lastName: '' },
      address: { street: '', city: '', state: '', zipCode: '', country: 'Sri Lanka' },
      phone: '',
      dateOfBirth: '',
      gender: '',
      medicalHistory: { bloodType: '', allergies: [], currentMedications: [] }
    });
    const [allergyInput, setAllergyInput] = useState('');
    const [medicationInput, setMedicationInput] = useState('');
    const [formError, setFormError] = useState('');

    const validatePhone = (phone) => {
      const phoneRegex = /^\+?\d{10,15}$/;
      return phoneRegex.test(phone);
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!validatePhone(formData.phone)) {
        setFormError('Please enter a valid phone number (10-15 digits)');
        return;
      }
      try {
        await axios.post(`${api}/api/patients`, {
          ...formData,
          name: {
            ...formData.name,
            fullName: `${formData.name.firstName} ${formData.name.lastName}`
          },
          age: calculateAge(formData.dateOfBirth)
        }, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setShowAddPatient(false);
        setFormError('');
        debouncedFetchPatients(searchTerm);
      } catch (err) {
        setFormError(err.response?.data?.message || 'Failed to add patient');
      }
    };

    const addAllergy = () => {
      if (allergyInput.trim()) {
        setFormData({
          ...formData,
          medicalHistory: {
            ...formData.medicalHistory,
            allergies: [...formData.medicalHistory.allergies, allergyInput.trim()]
          }
        });
        setAllergyInput('');
      }
    };

    const addMedication = () => {
      if (medicationInput.trim()) {
        setFormData({
          ...formData,
          medicalHistory: {
            ...formData.medicalHistory,
            currentMedications: [...formData.medicalHistory.currentMedications, medicationInput.trim()]
          }
        });
        setMedicationInput('');
      }
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Add New Patient</h2>
            <button onClick={() => setShowAddPatient(false)} className="p-2 hover:bg-gray-100 rounded-full" aria-label="Close form">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          {formError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {formError}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name *</label>
                <input
                  type="text"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                  value={formData.name.firstName}
                  onChange={(e) => setFormData({ ...formData, name: { ...formData.name, firstName: e.target.value } })}
                  aria-required="true"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name *</label>
                <input
                  type="text"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                  value={formData.name.lastName}
                  onChange={(e) => setFormData({ ...formData, name: { ...formData.name, lastName: e.target.value } })}
                  aria-required="true"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date of Birth *</label>
                <input
                  type="date"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  max={new Date().toISOString().split('T')[0]}
                  aria-required="true"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Gender *</label>
                <select
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  aria-required="true"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone *</label>
                <input
                  type="tel"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1234567890"
                  aria-required="true"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Blood Type</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                  value={formData.medicalHistory.bloodType}
                  onChange={(e) => setFormData({
                    ...formData,
                    medicalHistory: { ...formData.medicalHistory, bloodType: e.target.value }
                  })}
                >
                  <option value="">Select Blood Type</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">Allergies</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                    value={allergyInput}
                    onChange={(e) => setAllergyInput(e.target.value)}
                    placeholder="Enter allergy and press Add"
                  />
                  <button
                    type="button"
                    onClick={addAllergy}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    aria-label="Add allergy"
                  >
                    Add
                  </button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.medicalHistory.allergies.map((allergy, index) => (
                    <span key={index} className="bg-red-100 text-red-800 text-sm px-2 py-1 rounded-full flex items-center">
                      {allergy}
                      <button
                        onClick={() => setFormData({
                          ...formData,
                          medicalHistory: {
                            ...formData.medicalHistory,
                            allergies: formData.medicalHistory.allergies.filter((_, i) => i !== index)
                          }
                        })}
                        className="ml-2 text-red-600"
                        aria-label={`Remove ${allergy}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">Current Medications</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                    value={medicationInput}
                    onChange={(e) => setMedicationInput(e.target.value)}
                    placeholder="Enter medication and press Add"
                  />
                  <button
                    type="button"
                    onClick={addMedication}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    aria-label="Add medication"
                  >
                    Add
                  </button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.medicalHistory.currentMedications.map((med, index) => (
                    <span key={index} className="bg-green-100 text-green-800 text-sm px-2 py-1 rounded-full flex items-center">
                      {med}
                      <button
                        onClick={() => setFormData({
                          ...formData,
                          medicalHistory: {
                            ...formData.medicalHistory,
                            currentMedications: formData.medicalHistory.currentMedications.filter((_, i) => i !== index)
                          }
                        })}
                        className="ml-2 text-green-600"
                        aria-label={`Remove ${med}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                    placeholder="Street"
                    value={formData.address.street}
                    onChange={(e) => setFormData({
                      ...formData,
                      address: { ...formData.address, street: e.target.value }
                    })}
                  />
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                    placeholder="City"
                    value={formData.address.city}
                    onChange={(e) => setFormData({
                      ...formData,
                      address: { ...formData.address, city: e.target.value }
                    })}
                  />
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                    placeholder="State"
                    value={formData.address.state}
                    onChange={(e) => setFormData({
                      ...formData,
                      address: { ...formData.address, state: e.target.value }
                    })}
                  />
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                    placeholder="Zip Code"
                    value={formData.address.zipCode}
                    onChange={(e) => setFormData({
                      ...formData,
                      address: { ...formData.address, zipCode: e.target.value }
                    })}
                  />
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                    placeholder="Country"
                    value={formData.address.country}
                    onChange={(e) => setFormData({
                      ...formData,
                      address: { ...formData.address, country: e.target.value }
                    })}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowAddPatient(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Save Patient
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const PatientDetailView = ({ patient }) => {
    const [showAddConsultation, setShowAddConsultation] = useState(false);

    const AddConsultationForm = () => {
      const [consultationData, setConsultationData] = useState({
        date: new Date().toISOString().split('T')[0],
        symptoms: '',
        diagnosis: '',
        medications: [{ medicineName: '', dosage: '', frequency: '', duration: '' }],
        notes: '',
        followUpRequired: false,
        followUpDate: ''
      });
      const [formError, setFormError] = useState('');

      const handleAddMedication = () => {
        setConsultationData({
          ...consultationData,
          medications: [...consultationData.medications, { medicineName: '', dosage: '', frequency: '', duration: '' }]
        });
      };

      const handleRemoveMedication = (index) => {
        setConsultationData({
          ...consultationData,
          medications: consultationData.medications.filter((_, i) => i !== index)
        });
      };

      const handleMedicationChange = (index, field, value) => {
        const newMedications = [...consultationData.medications];
        newMedications[index][field] = value;
        setConsultationData({ ...consultationData, medications: newMedications });
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        if (!consultationData.date) {
          setFormError('Please select a consultation date');
          return;
        }
        try {
          await axios.post(`${api}/api/patients/${patient._id}/consultations`, {
            ...consultationData,
            previousConsultation: patient.medicalHistory.consultationHistory?.length > 0
          }, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          setShowAddConsultation(false);
          setFormError('');
          debouncedFetchPatients(searchTerm);
          if (selectedPatient) {
            const response = await axios.get(`${api}/api/patients`, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              params: { search: patient.name.fullName }
            });
            setSelectedPatient(response.data.patients.find(p => p._id === patient._id));
          }
        } catch (err) {
          setFormError(err.response?.data?.message || 'Failed to add consultation');
        }
      };

      return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Add Consultation for {patient.name.fullName}</h2>
              <button onClick={() => setShowAddConsultation(false)} className="p-2 hover:bg-gray-100 rounded-full" aria-label="Close form">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            {formError && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {formError}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Consultation Date *</label>
                <input
                  type="date"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                  value={consultationData.date}
                  onChange={(e) => setConsultationData({ ...consultationData, date: e.target.value })}
                  max={new Date().toISOString().split('T')[0]}
                  aria-required="true"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Symptoms *</label>
                  <textarea
                    required
                    rows="4"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                    value={consultationData.symptoms}
                    onChange={(e) => setConsultationData({ ...consultationData, symptoms: e.target.value })}
                    placeholder="Describe symptoms..."
                    aria-required="true"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Diagnosis *</label>
                  <textarea
                    required
                    rows="4"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                    value={consultationData.diagnosis}
                    onChange={(e) => setConsultationData({ ...consultationData, diagnosis: e.target.value })}
                    placeholder="Enter diagnosis..."
                    aria-required="true"
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Medications</h3>
                  <button
                    type="button"
                    onClick={handleAddMedication}
                    className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700"
                    aria-label="Add medication"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Medication</span>
                  </button>
                </div>
                {consultationData.medications.map((med, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">Medication {index + 1}</h4>
                      {consultationData.medications.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMedication(index)}
                          className="text-red-600 hover:text-red-700"
                          aria-label={`Remove medication ${index + 1}`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Medicine Name *</label>
                        <input
                          type="text"
                          required
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                          value={med.medicineName}
                          onChange={(e) => handleMedicationChange(index, 'medicineName', e.target.value)}
                          placeholder="e.g., Lisinopril"
                          aria-required="true"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Dosage *</label>
                        <input
                          type="text"
                          required
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                          value={med.dosage}
                          onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                          placeholder="e.g., 10mg"
                          aria-required="true"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Frequency *</label>
                        <select
                          required
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                          value={med.frequency}
                          onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                          aria-required="true"
                        >
                          <option value="">Select frequency</option>
                          <option value="Once daily">Once daily</option>
                          <option value="Twice daily">Twice daily</option>
                          <option value="Three times daily">Three times daily</option>
                          <option value="As needed">As needed</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Duration *</label>
                        <input
                          type="text"
                          required
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                          value={med.duration}
                          onChange={(e) => handleMedicationChange(index, 'duration', e.target.value)}
                          placeholder="e.g., 7 days"
                          aria-required="true"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Notes</label>
                <textarea
                  rows="4"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                  value={consultationData.notes}
                  onChange={(e) => setConsultationData({ ...consultationData, notes: e.target.value })}
                  placeholder="Additional notes..."
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    checked={consultationData.followUpRequired}
                    onChange={(e) => setConsultationData({ ...consultationData, followUpRequired: e.target.checked })}
                  />
                  <span className="text-sm font-medium text-gray-700">Follow-up Required</span>
                </label>
                {consultationData.followUpRequired && (
                  <input
                    type="date"
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                    value={consultationData.followUpDate}
                    onChange={(e) => setConsultationData({ ...consultationData, followUpDate: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                  />
                )}
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddConsultation(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Save Consultation
                </button>
              </div>
            </form>
          </div>
        </div>
      );
    };

    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{patient.name.fullName}</h2>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <span>{patient.age} years • {patient.gender}</span>
                <span>|</span>
                <span>Blood Type: {patient.medicalHistory.bloodType || 'N/A'}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowAddConsultation(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            aria-label="Add new consultation"
          >
            <Plus className="w-4 h-4" />
            Add Consultation
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center gap-2 text-gray-600">
            <Phone className="w-4 h-4" />
            <span>{patient.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>DOB: {formatDate(patient.dateOfBirth)}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <FileText className="w-4 h-4" />
            <span>{patient.medicalHistory?.consultationHistory?.length || 0} consultations</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-4 h-4" />
            <span>Last Updated: {formatDate(patient.lastUpdated)}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>
              {patient.address.street && patient.address.city
                ? `${patient.address.street}, ${patient.address.city}, ${patient.address.state || ''} ${patient.address.zipCode || ''} ${patient.address.country || ''}`
                : 'No address provided'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <FileText className="w-4 h-4" />
            <span>Previous Consultation: {patient.medicalHistory.previousConsultation ? 'Yes' : 'No'}</span>
          </div>
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical History</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Allergies</h4>
              {patient.medicalHistory.allergies?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {patient.medicalHistory.allergies.map((allergy, index) => (
                    <span key={index} className="bg-red-100 text-red-800 text-sm px-2 py-1 rounded-full">
                      {allergy}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No known allergies</p>
              )}
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Current Medications</h4>
              {patient.medicalHistory.currentMedications?.length > 0 ? (
                <div className="space-y-2">
                  {patient.medicalHistory.currentMedications.map((med, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Pill className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-700">{med}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No current medications</p>
              )}
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Consultation History</h3>
          {patient.medicalHistory.consultationHistory?.length > 0 ? (
            <div className="space-y-4">
              {patient.medicalHistory.consultationHistory.map((consultation, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div 
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => setExpandedConsultations({
                      ...expandedConsultations,
                      [index]: !expandedConsultations[index]
                    })}
                    role="button"
                    aria-expanded={expandedConsultations[index]}
                    aria-label={`Toggle consultation ${patient.medicalHistory.consultationHistory.length - index}`}
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-indigo-600" />
                      <div>
                        <p className="font-medium text-gray-900">Consultation {patient.medicalHistory.consultationHistory.length - index}</p>
                        <p className="text-sm text-gray-500">{formatDate(consultation.date)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {consultation.followUpRequired && (
                        <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Follow-up
                        </span>
                      )}
                      {expandedConsultations[index] ? (
                        <ChevronUp className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      )}
                    </div>
                  </div>
                  {expandedConsultations[index] && (
                    <div className="mt-4 space-y-4">
                      <div>
                        <h5 className="font-medium text-gray-700">Symptoms</h5>
                        <p className="text-sm text-gray-600">{consultation.symptoms || 'N/A'}</p>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-700">Diagnosis</h5>
                        <p className="text-sm text-gray-600">{consultation.diagnosis || 'N/A'}</p>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-700">Medications</h5>
                        {consultation.medications?.length > 0 ? (
                          <div className="space-y-2">
                            {consultation.medications.map((med, medIndex) => (
                              <div key={medIndex} className="bg-gray-50 rounded-lg p-3 flex items-start justify-between">
                                <div>
                                  <p className="font-medium text-gray-900">{med.medicineName}</p>
                                  <p className="text-sm text-gray-600">
                                    {med.dosage} • {med.frequency} • {med.duration}
                                  </p>
                                </div>
                                <Pill className="w-4 h-4 text-green-600" />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-600">No medications prescribed</p>
                        )}
                      </div>
                      {consultation.notes && (
                        <div>
                          <h5 className="font-medium text-gray-700">Notes</h5>
                          <p className="text-sm text-gray-600">{consultation.notes}</p>
                        </div>
                      )}
                      {consultation.followUpRequired && consultation.followUpDate && (
                        <div className="flex items-center gap-2 text-sm text-orange-700 bg-orange-50 p-2 rounded">
                          <Clock className="w-4 h-4" />
                          <span>Follow-up: {formatDate(consultation.followUpDate)}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No consultation history</p>
              <button
                onClick={() => setShowAddConsultation(true)}
                className="mt-2 text-indigo-600 hover:text-indigo-700"
                aria-label="Add first consultation"
              >
                Add first consultation
              </button>
            </div>
          )}
        </div>
        {showAddConsultation && <AddConsultationForm />}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Patient Management</h1>
              <p className="text-gray-600 mt-1">Manage patient records and consultations</p>
            </div>
            <button
              onClick={() => setShowAddPatient(true)}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
              aria-label="Add new patient"
            >
              <UserPlus className="w-4 h-4" />
              Add New Patient
            </button>
          </div>
          {error && (
            <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}
        </div>
        {!selectedPatient ? (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, ID, or phone..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search patients"
              />
            </div>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-2"></div>
                <p className="text-gray-500">Loading...</p>
              </div>
            ) : patients.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <User className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No patients found</p>
                {searchTerm && <p className="text-sm mt-1">Try adjusting your search</p>}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {patients.map(patient => (
                  <PatientCard key={patient._id} patient={patient} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            <button
              onClick={() => setSelectedPatient(null)}
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-4"
              aria-label="Back to patient list"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Patients
            </button>
            <PatientDetailView patient={selectedPatient} />
          </div>
        )}
        {showAddPatient && <AddPatientForm />}
      </div>
    </div>
  );
};

export default PatientHistoryInterface;