import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import {
  FaMapMarkerAlt,
  FaBriefcase,
  FaUsers,
  FaChartLine,
  FaRocket,
  FaCheckCircle,
  FaSearch,
  FaArrowRight,
} from 'react-icons/fa';

const Home = () => {
  const features = [
    {
      icon: FaSearch,
      title: 'Smart Job Search',
      description: 'Find your perfect role with advanced filters and personalized recommendations.',
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
    },
    {
      icon: FaBriefcase,
      title: 'Quality Opportunities',
      description: 'Access verified companies and genuine job openings across industries.',
      color: 'text-accent-600',
      bgColor: 'bg-accent-50',
    },
    {
      icon: FaRocket,
      title: 'Career Growth',
      description: 'Track applications, save jobs, and manage your career journey in one place.',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      icon: FaUsers,
      title: 'Connect Directly',
      description: 'Apply directly to hiring managers and get faster responses.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
  ];

  const stats = [
    { value: '10,000+', label: 'Active Jobs' },
    { value: '5,000+', label: 'Companies' },
    { value: '50,000+', label: 'Job Seekers' },
    { value: '95%', label: 'Success Rate' },
  ];

  const benefits = [
    'Easy application process',
    'Real-time application tracking',
    'Personalized job recommendations',
    'Save jobs for later',
    'Direct company contact',
    'Resume builder support',
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '30px 30px'
          }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-white/10 rounded-full mb-6 backdrop-blur-sm">
                <FaMapMarkerAlt className="text-primary-300 mr-2" />
                <span className="text-sm font-medium">Your Career Journey Starts Here</span>
              </div>

              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                Find Your Perfect
                <span className="block text-primary-200">Placement</span>
              </h1>

              <p className="text-xl text-primary-100 mb-8 leading-relaxed">
                Connect with top companies, explore thousands of opportunities, and take the next step in your career with Placewise.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/jobs"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-700 rounded-lg font-semibold hover:bg-primary-50 transition-all shadow-lg hover:shadow-xl group"
                >
                  Browse Jobs
                  <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-primary-700 transition-all"
                >
                  Get Started Free
                </Link>
              </div>

              {/* Quick Stats */}
              <div className="mt-12 grid grid-cols-2 gap-6">
                <div>
                  <div className="text-3xl font-bold text-primary-200">10K+</div>
                  <div className="text-sm text-primary-100">Active Jobs</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary-200">5K+</div>
                  <div className="text-sm text-primary-100">Companies</div>
                </div>
              </div>
            </div>

            {/* Right Content - Floating Cards */}
            <div className="hidden lg:block relative">
              <div className="relative">
                {/* Main Card */}
                <div className="bg-white rounded-2xl shadow-2xl p-8 transform hover:scale-105 transition-transform">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <FaBriefcase className="text-primary-600 text-xl" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm text-gray-500">New Opportunity</div>
                      <div className="font-semibold text-gray-900">Senior Developer</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mb-4">
                    Top tech company • Remote • $80k-120k
                  </div>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs">React</span>
                    <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs">Node.js</span>
                    <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs">MongoDB</span>
                  </div>
                </div>

                {/* Floating Card 1 */}
                <div className="absolute -top-6 -right-6 bg-accent-500 text-white rounded-xl shadow-xl p-4 transform rotate-3 hover:rotate-0 transition-transform">
                  <div className="text-2xl font-bold">500+</div>
                  <div className="text-xs">Applications Today</div>
                </div>

                {/* Floating Card 2 */}
                <div className="absolute -bottom-6 -left-6 bg-purple-500 text-white rounded-xl shadow-xl p-4 transform -rotate-3 hover:rotate-0 transition-transform">
                  <div className="text-2xl font-bold">95%</div>
                  <div className="text-xs">Success Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Placewise?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to find your dream job and advance your career
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow group"
              >
                <div className={`${feature.bgColor} w-14 h-14 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`${feature.color} text-2xl`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-primary-100 text-sm lg:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Everything You Need to Succeed
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Placewise provides all the tools and features you need to find, apply, and land your dream job.
              </p>

              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <FaCheckCircle className="text-primary-600 text-xl mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>

              <Link
                to="/register"
                className="inline-block mt-8 px-8 py-4 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors shadow-lg"
              >
                Start Your Journey Today
              </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Ready to Get Started?
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold">
                    1
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-900">Create Account</h4>
                    <p className="text-sm text-gray-600">Sign up in less than 2 minutes</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold">
                    2
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-900">Build Profile</h4>
                    <p className="text-sm text-gray-600">Add your skills and experience</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold">
                    3
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-900">Apply to Jobs</h4>
                    <p className="text-sm text-gray-600">Start applying to opportunities</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold">
                    4
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-900">Get Hired</h4>
                    <p className="text-sm text-gray-600">Land your dream job!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FaChartLine className="text-6xl text-white mx-auto mb-6 opacity-90" />
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Take Your Career to the Next Level?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of successful job seekers who found their perfect placement with Placewise
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-block px-8 py-4 bg-white text-primary-700 rounded-lg font-semibold hover:bg-primary-50 transition-all shadow-lg"
            >
              Create Free Account
            </Link>
            <Link
              to="/jobs"
              className="inline-block px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-primary-700 transition-all"
            >
              Explore Jobs
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;