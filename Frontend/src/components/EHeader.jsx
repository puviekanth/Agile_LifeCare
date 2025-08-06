import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { FiBell, FiMenu, FiX , FiShoppingCart} from 'react-icons/fi';
import {jwtDecode} from 'jwt-decode'; // Browser-compatible JWT decoding
import logo from '../assets/images/logo.png';
import { Link } from 'react-router-dom';
import axios from 'axios';

const EHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [letter,setLetter] = useState('');
  const api = 'http://localhost:3000';
  const [number,setNumber] = useState('');
  useEffect( () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        jwtDecode(token); // Decode token (no verification needed for client-side)
        setIsLoggedIn(true);
         axios.get(`${api}/getLetter`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res)=>{
        setLetter(res.data.letter);
        setNumber(res.data.number);
      })
      .catch((error)=>{
        console.error('Error fetching the user letter',error)
      });
      } catch (error) {
        setIsLoggedIn(false);
        localStorage.removeItem('token');
      }

      

    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const navLinks = [
    { to: '/home' , label:'Home'},
    { to: '/products', label: 'Products' },
    { to: '/consultation', label: 'Book Consultation' },
    { to: '/prescription', label: 'Upload Prescription' },
    { to: '/contact-us', label: 'Contact Us' },
    { to: '/about-us', label: 'About Us' },
  ];

  const getNavLinkClass = ({ isActive }) =>
    isActive
      ? 'text-yellow-300 border-yellow-300 md:border-b-2 md:pb-1 border-l-4 md:border-l-0 pl-2 md:pl-0'
      : 'text-white hover:text-yellow-200 transition pl-2 md:pl-0';

  return (
    <header className="bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600 text-white shadow-md">
      <div className="max-w-screen-xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="Life Care Logo"
            className="w-10 h-10 object-contain rounded-md shadow-sm bg-white p-1"
          />
          <div>
            <h1 className="font-semibold text-lg leading-tight">Life Care</h1>
            <p className="text-xs text-gray-200 -mt-1">Channeling Services</p>
          </div>
        </div>

        <div className="md:hidden">
          <button onClick={toggleMenu}>
            {menuOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
          </button>
        </div>

        <nav className="hidden md:flex gap-6 text-sm font-medium">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className={getNavLinkClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? (
            <>

            <div className="relative">
              <Link to={'/cart'}>
                <FiShoppingCart className="text-xl text-white" />
                <span className="absolute -top-2 -right-2 bg-yellow-400 text-blue-800 text-xs w-4 h-4 flex items-center justify-center rounded-full font-semibold shadow-sm">
                  {number}
                </span>
                </Link>
              </div>
              
              <Link to='/profile' className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-blue-700 font-bold shadow-inner">
                {letter}
              </Link>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className="text-white hover:text-yellow-200 transition bg-blue-500 px-4 py-1 rounded-md"
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className="text-white hover:text-yellow-200 transition bg-green-500 px-4 py-1 rounded-md"
              >
                Sign Up
              </NavLink>
            </>
          )}
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden px-6 pb-4">
          <nav className="flex flex-col gap-4 text-sm font-medium bg-blue-900 rounded-md p-4 shadow-md">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={toggleMenu}
                className={getNavLinkClass}
              >
                {link.label}
              </NavLink>
            ))}
            <div className="flex justify-between items-center pt-4 border-t border-blue-800 mt-4">
              {isLoggedIn ? (
                <>
                  <div className="relative">
                <FiShoppingCart className="text-xl text-white" />
                <span className="absolute -top-2 -right-2 bg-yellow-400 text-blue-800 text-xs w-4 h-4 flex items-center justify-center rounded-full font-semibold shadow-sm">
                  3
                </span>
              </div>
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-blue-700 font-bold shadow-inner">
                    {letter}
                  </div>
                </>
              ) : (
                <div className="flex gap-4">
                  <NavLink
                    to="/login"
                    onClick={toggleMenu}
                    className="text-blue hover:text-yellow-200 transition bg-white-500 px-4 py-1 rounded-md"
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/register"
                    onClick={toggleMenu}
                    className="text-white hover:text-yellow-200 transition bg-green-500 px-4 py-1 rounded-md"
                  >
                    Sign Up
                  </NavLink>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default EHeader;