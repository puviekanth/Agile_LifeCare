import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiBell, FiMenu, FiX , FiShoppingCart} from 'react-icons/fi';
import {jwtDecode} from 'jwt-decode'; // Browser-compatible JWT decoding
import logo from '../assets/images/logo.png';
import { Link } from 'react-router-dom';
import axios from 'axios';

const DHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [letter,setLetter] = useState('');
  const api = import.meta.env.VITE_API;
  const [number,setNumber] = useState('');
  const navigate = useNavigate();
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

  const handleSignOut = () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    navigate('/login');
  };

  const navLinks = [
    { to: '/doc-view' , label:'Consultations'},
    { to: '/mg-pthis', label: 'Manage Patients' },
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

            
              <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors bg-red-400 text-black-500"
              aria-label="Sign out"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
              <Link to='/docprofile' className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-blue-700 font-bold shadow-inner">
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

      
    </header>
  );
};

export default DHeader;