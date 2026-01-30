import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaBars, FaTimes, FaMapMarkerAlt } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navLinks = {
    student: [
      { path: '/student/dashboard', label: 'Dashboard' },
      { path: '/jobs', label: 'Browse Jobs' },
      { path: '/student/applications', label: 'My Applications' },
      { path: '/student/saved', label: 'Saved Jobs' },
      { path: '/student/profile', label: 'Profile' },
    ],
    recruiter: [
      { path: '/recruiter/dashboard', label: 'Dashboard' },
      { path: '/recruiter/company', label: 'Company' },
      { path: '/recruiter/post-job', label: 'Post Job' },
      { path: '/recruiter/jobs', label: 'My Jobs' },
    ],
    admin: [
      { path: '/admin/dashboard', label: 'Dashboard' },
      { path: '/admin/users', label: 'Users' },
      { path: '/admin/companies', label: 'Companies' },
      { path: '/admin/jobs', label: 'Jobs' },
    ],
  };

  const links = user ? navLinks[user.role] || [] : [];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              {/* Icon */}
              <div className="relative">
                <FaMapMarkerAlt className="text-3xl text-primary-600 group-hover:text-primary-700 transition-colors" />
              </div>
              {/* Text */}
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                Placewise
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {!user ? (
              <>
                <Link to="/jobs" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Browse Jobs
                </Link>
                <Link to="/login" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Login
                </Link>
                <Link to="/register" className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors shadow-sm">
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                {links.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="flex items-center space-x-3 pl-3 border-l border-gray-300">
                  <span className="text-sm text-gray-700 font-medium">{user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-primary-600 focus:outline-none"
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {!user ? (
              <>
                <Link
                  to="/jobs"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors"
                  onClick={toggleMenu}
                >
                  Browse Jobs
                </Link>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors"
                  onClick={toggleMenu}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 rounded-md text-base font-medium bg-primary-600 text-white hover:bg-primary-700 transition-colors"
                  onClick={toggleMenu}
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <div className="px-3 py-2 border-b border-gray-200 mb-2">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                </div>
                {links.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors"
                    onClick={toggleMenu}
                  >
                    {link.label}
                  </Link>
                ))}
                <button
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;