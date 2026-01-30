import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobAPI } from '../../services/api';
import Navbar from '../../components/common/Navbar';
import Loader from '../../components/common/Loader';
import { formatDate, formatSalary } from '../../utils/helpers';
import toast from 'react-hot-toast';
import { FaBriefcase, FaEdit, FaTrash, FaEye, FaUsers } from 'react-icons/fa';

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    filterJobs();
  }, [statusFilter, jobs]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await jobAPI.getMyJobs();
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
    } else {
      setFilteredJobs(jobs.filter((job) => job.status === statusFilter));
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) {
      return;
    }

    try {
      await jobAPI.deleteJob(jobId);
      setJobs(jobs.filter((job) => job._id !== jobId));
      toast.success('Job deleted successfully');
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error(error.response?.data?.message || 'Failed to delete job');
    }
  };

  const getStatusCount = (status) => {
    if (status === 'all') return jobs.length;
    return jobs.filter((job) => job.status === status).length;
  };

  const statusOptions = [
    { value: 'all', label: 'All Jobs' },
    { value: 'active', label: 'Active' },
    { value: 'pending', label: 'Pending Approval' },
    { value: 'closed', label: 'Closed' },
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Jobs</h1>
            <p className="text-gray-600">Manage all your job postings</p>
          </div>
          <Link
            to="/recruiter/post-job"
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Post New Job
          </Link>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex gap-4 mb-6 overflow-x-auto">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setStatusFilter(option.value)}
              className={`px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-colors ${
                statusFilter === option.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {option.label} ({getStatusCount(option.value)})
            </button>
          ))}
        </div>

        {/* Jobs List */}
        {filteredJobs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FaBriefcase className="mx-auto text-gray-300 text-6xl mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {statusFilter === 'all'
                ? 'No jobs posted yet'
                : `No ${statusOptions.find((o) => o.value === statusFilter)?.label.toLowerCase()}`}
            </h3>
            <p className="text-gray-600 mb-6">
              {statusFilter === 'all'
                ? 'Start posting jobs to attract great candidates'
                : `You don't have any ${statusOptions.find((o) => o.value === statusFilter)?.label.toLowerCase()}`}
            </p>
            {statusFilter === 'all' && (
              <Link
                to="/recruiter/post-job"
                className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Post Your First Job
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <div
                key={job._id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {job.title}
                        </h3>
                        <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                          <span>{job.location}</span>
                          <span>•</span>
                          <span>{job.jobType}</span>
                          <span>•</span>
                          <span>{job.experienceLevel}</span>
                          <span>•</span>
                          <span>{formatSalary(job.salary?.min, job.salary?.max, job.salaryType)}</span>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ml-4 ${
                          job.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : job.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {job.status}
                      </span>
                    </div>

                    <div className="mt-4 flex items-center gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <FaUsers />
                        <span>{job.applicationsCount || 0} applicants</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaEye />
                        <span>{job.views || 0} views</span>
                      </div>
                      <span>Posted {formatDate(job.createdAt)}</span>
                      <span>Deadline: {formatDate(job.applicationDeadline)}</span>
                    </div>

                    {job.skills && job.skills.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {job.skills.slice(0, 5).map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-primary-50 text-primary-700 text-xs rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                        {job.skills.length > 5 && (
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{job.skills.length - 5} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <Link
                    to={`/recruiter/jobs/${job._id}/applicants`}
                    className="flex-1 px-4 py-2 text-center bg-primary-600 text-white rounded-md hover:bg-primary-700"
                  >
                    View Applicants ({job.applicationsCount || 0})
                  </Link>
                  <Link
                    to={`/jobs/${job._id}`}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center gap-2"
                  >
                    <FaEye /> Preview
                  </Link>
                  <button
                    onClick={() => handleDelete(job._id)}
                    className="px-4 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50 flex items-center gap-2"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyJobs;
