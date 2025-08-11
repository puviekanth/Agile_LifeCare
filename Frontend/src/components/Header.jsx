import { useState , useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiBell, FiMenu, FiX } from 'react-icons/fi';
import logo from '../assets/images/logo.png';
import {Link} from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const navigate = useNavigate();
  const [letter,setLetter] = useState('');
  const api = import.meta.env.VITE_API;
  const [isLoggedIn,setIsLoggedIn] = useState(false);

  // Define navigation links in an array for reusability
  const navLinks = [
    { to: "/bill", label: "Bill Products" },
    { to: "/inventory", label: "Inventory" },
    { to: "/suppliers", label: "Suppliers" },
    { to:'/prescriptions', label:'Prescriptions'},
    { to:'/orders' , label:'Orders' },
    { to:'/upload-list' , label:'Upload Verified Medicine List'},
    { to:'/analytics' , label:'Analytics'}
  ];

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

  const handleSignOut = () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Common styles for NavLink
  const getNavLinkClass = ({ isActive }) =>
    isActive
      ? 'text-yellow-300 border-yellow-300 md:border-b-2 md:pb-1 border-l-4 md:border-l-0 pl-2 md:pl-0'
      : 'text-white hover:text-yellow-200 transition pl-2 md:pl-0';



  return (
    <header className="bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600 text-white shadow-md">
      <div className="max-w-screen-xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo and Title */}
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

        {/* Hamburger icon */}
        <div className="md:hidden">
          <button onClick={toggleMenu}>
            {menuOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6 text-sm font-medium">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={getNavLinkClass}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Right Side Icons - Desktop */}
        <div className="hidden md:flex items-center gap-4">
          <div className="relative">
          </div>
          <Link to='/profile' className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-blue-700 font-bold shadow-inner">
                {letter}
          </Link>
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
        </div>
      </div>

      {/* Mobile Menu */}
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
              <div className="flex gap-2 items-center text-white">
                <FiBell className="text-lg" />
                <span className="text-xs bg-yellow-400 text-blue-800 px-2 py-1 rounded-full font-semibold">3</span>
              </div>
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-blue-700 font-bold shadow-inner">
                A
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;