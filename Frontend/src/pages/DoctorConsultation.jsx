import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Phone, User, FileText, ChevronLeft, ChevronRight, X } from 'lucide-react';
import DoctorHeader from '../components/DHeader';

const DoctorInterface = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [consultations, setConsultations] = useState([]);
  const [dayConsultations, setDayConsultations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // You need to replace this with your actual JWT token
  // In production, get this from localStorage, context, or other secure storage
  const token = localStorage.getItem('token');
  const api = import.meta.env.VITE_API;

  // Mock consultation data for demonstration
  const mockConsultations = [
    {
      _id: '1',
      user: {
        name: 'John Smith',
        email: 'john.smith@email.com',
        phone: '1234567890'
      },
      patient: {
        name: 'John Smith',
        age: 35,
        gender: 'Male',
        reason: 'Regular checkup and blood pressure monitoring'
      },
      location: {
        lat: 6.9271,
        lng: 79.8612,
        link: 'https://maps.google.com/?q=6.9271,79.8612'
      },
      slot: {
        date: new Date('2025-08-08'),
        time: '09:00'
      },
      status: 'Confirmed'
    },
    {
      _id: '2',
      user: {
        name: 'Sarah Johnson',
        email: 'sarah.j@email.com',
        phone: '0987654321'
      },
      patient: {
        name: 'Sarah Johnson',
        age: 28,
        gender: 'Female',
        reason: 'Follow-up consultation for migraine treatment'
      },
      location: {
        lat: 6.9319,
        lng: 79.8478,
        link: 'https://maps.google.com/?q=6.9319,79.8478'
      },
      slot: {
        date: new Date('2025-08-08'),
        time: '10:30'
      },
      status: 'Confirmed'
    },
    {
      _id: '3',
      user: {
        name: 'Mike Wilson',
        email: 'mike.w@email.com',
        phone: '1122334455'
      },
      patient: {
        name: 'Mike Wilson',
        age: 45,
        gender: 'Male',
        reason: 'Diabetes management and dietary consultation'
      },
      location: {
        lat: 6.9147,
        lng: 79.8730,
        link: 'https://maps.google.com/?q=6.9147,79.8730'
      },
      slot: {
        date: new Date('2025-08-10'),
        time: '14:00'
      },
      status: 'Pending'
    }
  ];

  useEffect(() => {
    const fetchConsultations = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('Fetching consultations from API...');
        console.log('API URL:', `${api}/api/getconsultations`);
        console.log('Token:', token);
        
        const res = await fetch(`${api}/api/getconsultations`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('Response status:', res.status);
        console.log('Response ok:', res.ok);
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        console.log('Received data from API:', data);
        
        // Convert date strings back to Date objects if needed
        const processedData = data.map(consultation => ({
          ...consultation,
          slot: {
            ...consultation.slot,
            date: new Date(consultation.slot.date)
          }
        }));
        
        setConsultations(processedData);
        setLoading(false);
        
      } catch (error) {
        console.error('Error fetching consultations:', error);
        setError(`Failed to load consultations: ${error.message}`);
        setLoading(false);
        
        // Only use mock data as fallback in development
        console.log('Using mock data as fallback');
        setConsultations(mockConsultations);
      }
    };

    fetchConsultations();
  }, [api, token]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const hasConsultations = (date) => {
    if (!date) return false;
    return consultations.some(consultation => {
      const consultationDate = new Date(consultation.slot.date);
      return consultationDate.toDateString() === date.toDateString();
    });
  };

  const getConsultationsForDate = (date) => {
    return consultations.filter(consultation => {
      const consultationDate = new Date(consultation.slot.date);
      return consultationDate.toDateString() === date.toDateString();
    });
  };

  const handleDateClick = (date) => {
    if (!date || !hasConsultations(date)) return;
    setSelectedDate(date);
    setDayConsultations(getConsultationsForDate(date));
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const days = getDaysInMonth(currentDate);
  const monthYear = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <>
    < DoctorHeader />
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Doctor Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your consultations and appointments</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Consultation Days</span>
              </div>
            </div>
          </div>
          
          {error && (
            <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              <p>{error}</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Calendar Section */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">{monthYear}</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => navigateMonth(-1)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <button
                    onClick={() => navigateMonth(1)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-3 text-center text-sm font-medium text-gray-500">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {days.map((date, index) => (
                  <div
                    key={index}
                    className={`
                      p-3 text-center cursor-pointer transition-all duration-200 rounded-lg
                      ${date ? 'hover:bg-gray-100' : ''}
                      ${date && hasConsultations(date) 
                        ? 'bg-blue-500 text-white hover:bg-blue-600' 
                        : date ? 'text-gray-900' : 'text-gray-400'
                      }
                      ${date && date.toDateString() === new Date().toDateString() 
                        ? 'ring-2 ring-blue-500' : ''
                      }
                    `}
                    onClick={() => handleDateClick(date)}
                  >
                    {date ? date.getDate() : ''}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Consultations Panel */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedDate ? `Consultations for ${selectedDate.toLocaleDateString()}` : 'Select a date'}
                </h3>
                {selectedDate && (
                  <button
                    onClick={() => setSelectedDate(null)}
                    className="p-1 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                )}
              </div>

              {loading ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-3"></div>
                  <p>Loading consultations...</p>
                </div>
              ) : !selectedDate ? (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Click on a highlighted date to view consultations</p>
                </div>
              ) : dayConsultations.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No consultations for this date</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {dayConsultations.map(consultation => (
                    <div key={consultation._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="font-medium text-gray-900">{consultation.user.name}</span>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(consultation.status)}`}>
                          {consultation.status}
                        </span>
                      </div>

                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4" />
                          <span>{consultation.user.phone}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span>{consultation.slot.time}</span>
                        </div>
                        
                        <div className="flex items-start space-x-2">
                          <MapPin className="w-4 h-4 mt-0.5" />
                          <a 
                            href={consultation.location.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            View Location
                          </a>
                        </div>
                        
                        <div className="flex items-start space-x-2">
                          <FileText className="w-4 h-4 mt-0.5" />
                          <span className="text-gray-700">{consultation.patient.reason}</span>
                        </div>
                        
                        <div className="mt-3 p-2 bg-gray-50 rounded">
                          <p className="text-xs font-medium text-gray-500 mb-1">Patient Details</p>
                          <p className="text-sm">{consultation.patient.name}, {consultation.patient.age} years, {consultation.patient.gender}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Add status update functionality */}
              {selectedDate && dayConsultations.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 text-center">
                    Click on consultation status to update
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Legend */}
        <div className="md:hidden mt-6 bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Consultation Days</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default DoctorInterface;