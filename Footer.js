import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaGithub, FaLinkedin, FaTwitter, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4 group">
              <FaMapMarkerAlt className="text-3xl text-primary-500 group-hover:text-primary-400 transition-colors" />
              <span className="text-2xl font-bold text-white">Placewise</span>
            </Link>
            <p className="text-gray-400 mb-4 max-w-md">
              Connecting talented individuals with their dream opportunities. 
              Your next career move starts here.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary-500 transition-colors"
                aria-label="GitHub"
              >
                <FaGithub size={20} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary-500 transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedin size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary-500 transition-colors"
                aria-label="Twitter"
              >
                <FaTwitter size={20} />
              </a>
              <a
                href="mailto:support@placewise.com"
                className="text-gray-400 hover:text-primary-500 transition-colors"
                aria-label="Email"
              >
                <FaEnvelope size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">For Job Seekers</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/jobs" className="hover:text-primary-500 transition-colors">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-primary-500 transition-colors">
                  Create Account
                </Link>
              </li>
              <li>
                <Link to="/student/applications" className="hover:text-primary-500 transition-colors">
                  My Applications
                </Link>
              </li>
              <li>
                <Link to="/student/saved" className="hover:text-primary-500 transition-colors">
                  Saved Jobs
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">For Employers</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/recruiter/post-job" className="hover:text-primary-500 transition-colors">
                  Post a Job
                </Link>
              </li>
              <li>
                <Link to="/recruiter/company" className="hover:text-primary-500 transition-colors">
                  Company Profile
                </Link>
              </li>
              <li>
                <Link to="/recruiter/jobs" className="hover:text-primary-500 transition-colors">
                  Manage Jobs
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-primary-500 transition-colors">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} Placewise. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-gray-400 hover:text-primary-500 text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-400 hover:text-primary-500 text-sm transition-colors">
              Terms of Service
            </Link>
            <Link to="/contact" className="text-gray-400 hover:text-primary-500 text-sm transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;