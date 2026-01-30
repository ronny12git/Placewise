import React, { useState, useEffect } from 'react';
import { applicationAPI } from '../../services/api';
import Navbar from '../../components/common/Navbar';
import ApplicationCard from '../../components/student/ApplicationCard';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';
import { FaFilter, FaFileAlt } from 'react-icons/fa';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [statusFilter, applications]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await applicationAPI.getMyApplications();
      setApplications(response.data.data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = () => {
    if (statusFilter === 'all') {
      setFilteredApplications(applications);
    } else {
      setFilteredApplications(
        applications.filter((app) => app.status === statusFilter)
      );
    }
  };

  const getStatusCount = (status) => {
    if (status === 'all') return applications.length;
    return applications.filter((app) => app.status === status).length;
  };

  const statusOptions = [
    { value: 'all', label: 'All Applications', color: 'text-gray-700' },
    { value: 'pending', label: 'Pending', color: 'text-yellow-700' },
    { value: 'shortlisted', label: 'Shortlisted', color: 'text-blue-700' },
    { value: 'interview', label: 'Interview', color: 'text-purple-700' },
    { value: 'rejected', label: 'Rejected', color: 'text-red-700' },
    { value: 'hired', label: 'Hired', color: 'text-green-700' },
  ];

  if (loading) {
    return (
      <>
        <Navbar />
        <Loader fullScreen />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Applications
          </h1>
          <p className="text-gray-600">
            Track the status of all your job applications
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setStatusFilter(option.value)}
              className={`p-4 rounded-lg border-2 transition-all ${
                statusFilter === option.value
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className={`text-2xl font-bold ${option.color}`}>
                {getStatusCount(option.value)}
              </div>
              <div className="text-sm text-gray-600 mt-1">{option.label}</div>
            </button>
          ))}
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center gap-4">
            <FaFilter className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label} ({getStatusCount(option.value)})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Applications List */}
        {filteredApplications.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FaFileAlt className="mx-auto text-gray-300 text-6xl mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {statusFilter === 'all'
                ? 'No applications yet'
                : `No ${statusOptions.find((o) => o.value === statusFilter)?.label.toLowerCase()} applications`}
            </h3>
            <p className="text-gray-600 mb-6">
              {statusFilter === 'all'
                ? "Start applying to jobs to see them here"
                : `You don't have any ${statusOptions.find((o) => o.value === statusFilter)?.label.toLowerCase()} applications yet`}
            </p>
            {statusFilter === 'all' && (
              <a
                href="/jobs"
                className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Browse Jobs
              </a>
            )}
            {statusFilter !== 'all' && (
              <button
                onClick={() => setStatusFilter('all')}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                View all applications
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="mb-4 text-gray-600">
              Showing {filteredApplications.length}{' '}
              {filteredApplications.length === 1 ? 'application' : 'applications'}
            </div>
            <div className="space-y-4">
              {filteredApplications.map((application) => (
                <ApplicationCard key={application._id} application={application} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyApplications;
