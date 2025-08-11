import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import EHeader from '../components/EHeader';

function Signup() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone,setPhone] = useState('');
  const [ address , setAddress] = useState('');
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const api = import.meta.env.VITE_API;
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+(\.admin)?@lifecare\.com$|^[^\s@]+@(gmail\.com|outlook\.com|hotmail\.com|icloud\.com)$/;
    

    if (!email || !emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!name) {
      newErrors.name = 'Please enter your full name';
    }
    if (!password) {
      newErrors.password = 'Please enter a password';
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if(phone.length!=10){
      newErrors.phone = 'Contact should have 10 digits';
    }
    if(!address){
      newErrors.address = 'Please enter an address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      axios.post(`${api}/signup`, { name, email, password , phone , address })
        .then(result => {
          console.log(result);
          navigate('/login');
        })
        .catch(err => {
          if (err.response && err.response.data && err.response.data.error) {
            setServerError(err.response.data.error);
          } else {
            setServerError('An unexpected error occurred');
          }
        });
    }
  };

  return (
    <>
    
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
      {serverError && <p className="text-red-500 text-sm text-center mb-4">{serverError}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="sr-only">Full Name</label>
          <input
            id="name"
            type="text"
            placeholder="Full Name"
            className="w-full p-2 border rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="sr-only">Email address</label>
          <input
            id="email"
            type="email"
            placeholder="Email address"
            className="w-full p-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="sr-only">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            className="w-full p-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            className="w-full p-2 border rounded"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="phone" className="sr-only">Contact</label>
          <input
            id="phone"
            type="text"
            placeholder="Enter the Contact"
            className="w-full p-2 border rounded"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="q=address" className="sr-only">Address</label>
          <input
            id="address"
            type="text"
            placeholder="Enter Address"
            className="w-full p-2 border rounded"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
          {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded mb-4"
        >
          Sign Up
        </button>
        <div className="text-center mb-4">or</div>
        
        <p className="text-center text-blue-500 text-sm">
          Already have an account? <Link to="/login" className="underline">Log in</Link>
        </p>
      </form>
    </div>
  </>    
  );
}

export default Signup;