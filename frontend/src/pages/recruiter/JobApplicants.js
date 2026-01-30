import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { jobAPI, applicationAPI } from '../../services/api';
import Navbar from '../../components/common/Navbar';
import ApplicantCard from '../../components/recruiter/ApplicantCard';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';
import { FaArrowLeft, FaUsers, FaFilter } from 'react-icons/fa';

const JobApplicants = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchData();
  }, [id]);

  useEffect(() => {
    filterApplications();
  }, [statusFilter, applications]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch job details
      const jobResponse = await jobAPI.getJob(id);
      setJob(jobResponse.data.data);

      // Fetch applications
      const appsResponse = await applicationAPI.getJobApplications(id);
      setApplications(appsResponse.data.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load applicants');
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

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      await applicationAPI.updateApplicationStatus(applicationId, {
        status: newStatus,
      });
      
      // Update local state
      setApplications(
        applications.map((app) =>
          app._id === applicationId ? { ...app, status: newStatus } : app
        )
      );
      
      toast.success('Application status updated');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  const getStatusCount = (status) => {
    if (status === 'all') return applications.length;
    return applications.filter((app) => app.status === status).length;
  };

  const statusOptions = [
    { value: 'all', label: 'All Applicants' },
    { value: 'pending', label: 'Pending' },
    { value: 'shortlisted', label: 'Shortlisted' },
    { value: 'interview', label: 'Interview' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'hired', label: 'Hired' },
  ];

  if (loading) {
    return (
      <>
        <Navbar />
        <Loader fullScreen />
      </>
    );
  }

  if (!job) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Job not found
            </h2>
            <Link
              to="/recruiter/jobs"
              className="text-primary-600 hover:text-primary-700"
            >
              Back to My Jobs
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          to="/recruiter/jobs"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <FaArrowLeft className="mr-2" />
          Back to My Jobs
        </Link>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h1>
          <div className="flex flex-wrap gap-3 text-sm text-gray-600">
            <span>{job.location}</span>
            <span>•</span>
            <span>{job.jobType}</span>
            <span>•</span>
            <span>{job.experienceLevel}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
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
              <div className="text-2xl font-bold text-gray-900">
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

        {/* Applicants List */}
        {filteredApplications.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FaUsers className="mx-auto text-gray-300 text-6xl mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {statusFilter === 'all'
                ? 'No applicants yet'
                : `No ${statusOptions.find((o) => o.value === statusFilter)?.label.toLowerCase()} applicants`}
            </h3>
            <p className="text-gray-600">
              {statusFilter === 'all'
                ? 'Applications will appear here once candidates start applying'
                : `You don't have any ${statusOptions.find((o) => o.value === statusFilter)?.label.toLowerCase()} applicants yet`}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4 text-gray-600">
              Showing {filteredApplications.length}{' '}
              {filteredApplications.length === 1 ? 'applicant' : 'applicants'}
            </div>
            <div className="space-y-6">
              {filteredApplications.map((application) => (
                <ApplicantCard
                  key={application._id}
                  application={application}
                  onUpdateStatus={handleStatusUpdate}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default JobApplicants;
