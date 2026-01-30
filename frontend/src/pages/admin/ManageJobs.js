import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import Navbar from '../../components/common/Navbar';
import ApprovalCard from '../../components/admin/ApprovalCard';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';
import { FaBriefcase, FaFilter } from 'react-icons/fa';

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('pending');

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    filterJobs();
  }, [statusFilter, jobs]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllJobs();
      setJobs(response.data.data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const filterJobs = () => {
    if (statusFilter === 'all') {
      setFilteredJobs(jobs);
    } else if (statusFilter === 'pending') {
      setFilteredJobs(jobs.filter((job) => !job.isApproved));
    } else if (statusFilter === 'approved') {
      setFilteredJobs(jobs.filter((job) => job.isApproved));
    }
  };

  const handleApprove = async (jobId) => {
    try {
      await adminAPI.approveJob(jobId, { isApproved: true, status: 'active' });
      setJobs(
        jobs.map((job) =>
          job._id === jobId
            ? { ...job, isApproved: true, status: 'active' }
            : job
        )
      );
      toast.success('Job approved successfully');
    } catch (error) {
      console.error('Error approving job:', error);
      toast.error(error.response?.data?.message || 'Failed to approve job');
    }
  };

  const handleReject = async (jobId) => {
    try {
      await adminAPI.approveJob(jobId, { isApproved: false, status: 'closed' });
      setJobs(jobs.filter((job) => job._id !== jobId));
      toast.success('Job rejected');
    } catch (error) {
      console.error('Error rejecting job:', error);
      toast.error(error.response?.data?.message || 'Failed to reject job');
    }
  };

  const getStatusCount = (status) => {
    if (status === 'all') return jobs.length;
    if (status === 'pending') return jobs.filter((j) => !j.isApproved).length;
    if (status === 'approved') return jobs.filter((j) => j.isApproved).length;
    return 0;
  };

  const statusOptions = [
    { value: 'pending', label: 'Pending Approval' },
    { value: 'approved', label: 'Approved' },
    { value: 'all', label: 'All Jobs' },
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Jobs</h1>
          <p className="text-gray-600">Review and approve job postings</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
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

        {/* Filter */}
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

        {/* Jobs List */}
        {filteredJobs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FaBriefcase className="mx-auto text-gray-300 text-6xl mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {statusFilter === 'pending'
                ? 'No pending jobs'
                : statusFilter === 'approved'
                ? 'No approved jobs'
                : 'No jobs found'}
            </h3>
            <p className="text-gray-600">
              {statusFilter === 'pending'
                ? 'All jobs have been reviewed'
                : 'Jobs will appear here once they are posted'}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4 text-gray-600">
              Showing {filteredJobs.length}{' '}
              {filteredJobs.length === 1 ? 'job' : 'jobs'}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredJobs.map((job) => (
                <ApprovalCard
                  key={job._id}
                  item={job}
                  type="job"
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ManageJobs;
