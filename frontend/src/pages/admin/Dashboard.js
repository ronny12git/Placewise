import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import Navbar from '../../components/common/Navbar';
import StatsCard from '../../components/admin/StatsCard';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';
import {
  FaUsers,
  FaBuilding,
  FaBriefcase,
  FaFileAlt,
  FaClock,
  FaCheckCircle,
} from 'react-icons/fa';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getDashboardStats();
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Loader fullScreen />
      </>
    );
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: FaUsers,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Companies',
      value: stats?.totalCompanies || 0,
      icon: FaBuilding,
      color: 'bg-purple-500',
    },
    {
      title: 'Total Jobs',
      value: stats?.totalJobs || 0,
      icon: FaBriefcase,
      color: 'bg-green-500',
    },
    {
      title: 'Total Applications',
      value: stats?.totalApplications || 0,
      icon: FaFileAlt,
      color: 'bg-yellow-500',
    },
    {
      title: 'Pending Companies',
      value: stats?.pendingCompanies || 0,
      icon: FaClock,
      color: 'bg-orange-500',
    },
    {
      title: 'Pending Jobs',
      value: stats?.pendingJobs || 0,
      icon: FaClock,
      color: 'bg-red-500',
    },
  ];

  const quickLinks = [
    {
      title: 'Manage Users',
      description: 'View and manage all user accounts',
      link: '/admin/users',
      icon: FaUsers,
      color: 'text-blue-600',
    },
    {
      title: 'Manage Companies',
      description: 'Approve and manage company profiles',
      link: '/admin/companies',
      icon: FaBuilding,
      color: 'text-purple-600',
      badge: stats?.pendingCompanies > 0 ? stats.pendingCompanies : null,
    },
    {
      title: 'Manage Jobs',
      description: 'Approve and manage job postings',
      link: '/admin/jobs',
      icon: FaBriefcase,
      color: 'text-green-600',
      badge: stats?.pendingJobs > 0 ? stats.pendingJobs : null,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Platform overview and management
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <StatsCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
            />
          ))}
        </div>

        {/* Pending Approvals Alert */}
        {(stats?.pendingCompanies > 0 || stats?.pendingJobs > 0) && (
          <div className="mb-8 bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <FaClock className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Pending Approvals
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    You have {stats.pendingCompanies} pending{' '}
                    {stats.pendingCompanies === 1 ? 'company' : 'companies'} and{' '}
                    {stats.pendingJobs} pending {stats.pendingJobs === 1 ? 'job' : 'jobs'}{' '}
                    waiting for approval.
                  </p>
                </div>
                <div className="mt-4 flex gap-4">
                  {stats.pendingCompanies > 0 && (
                    <Link
                      to="/admin/companies"
                      className="text-sm font-medium text-yellow-800 hover:text-yellow-900"
                    >
                      Review Companies →
                    </Link>
                  )}
                  {stats.pendingJobs > 0 && (
                    <Link
                      to="/admin/jobs"
                      className="text-sm font-medium text-yellow-800 hover:text-yellow-900"
                    >
                      Review Jobs →
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickLinks.map((link, index) => (
              <Link
                key={index}
                to={link.link}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow relative"
              >
                {link.badge && (
                  <span className="absolute top-4 right-4 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                    {link.badge}
                  </span>
                )}
                <link.icon className={`${link.color} text-3xl mb-3`} />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {link.title}
                </h3>
                <p className="text-gray-600 text-sm">{link.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* User Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              User Breakdown
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Students</span>
                <span className="text-2xl font-bold text-gray-900">
                  {stats?.usersByRole?.student || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Recruiters</span>
                <span className="text-2xl font-bold text-gray-900">
                  {stats?.usersByRole?.recruiter || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Admins</span>
                <span className="text-2xl font-bold text-gray-900">
                  {stats?.usersByRole?.admin || 0}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Platform Activity
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Active Jobs</span>
                <span className="text-2xl font-bold text-green-600">
                  {stats?.activeJobs || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Approved Companies</span>
                <span className="text-2xl font-bold text-primary-600">
                  {stats?.approvedCompanies || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Active Users</span>
                <span className="text-2xl font-bold text-blue-600">
                  {stats?.activeUsers || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
