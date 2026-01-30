import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { companyAPI, jobAPI, applicationAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/common/Navbar';
import Loader from '../../components/common/Loader';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';
import {
  FaBriefcase,
  FaUsers,
  FaClock,
  FaCheckCircle,
  FaBuilding,
  FaPlus,
} from 'react-icons/fa';

const RecruiterDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState(null);
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    pendingApplications: 0,
  });
  const [recentJobs, setRecentJobs] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch company
      const companyResponse = await companyAPI.getMyCompany();
      const companyData = companyResponse.data.data;
      setCompany(companyData);

      if (!companyData) {
        setLoading(false);
        return;
      }

      // Fetch jobs
      const jobsResponse = await jobAPI.getMyJobs();
      const jobs = jobsResponse.data.data || [];
      setRecentJobs(jobs.slice(0, 5));

      // Calculate job stats
      const activeJobs = jobs.filter((job) => job.status === 'active').length;
      setStats((prev) => ({
        ...prev,
        totalJobs: jobs.length,
        activeJobs: activeJobs,
      }));

      // Fetch applications for all jobs
      let allApplications = [];
      for (const job of jobs) {
        try {
          const appResponse = await applicationAPI.getJobApplications(job._id);
          allApplications = [...allApplications, ...(appResponse.data.data || [])];
        } catch (error) {
          console.error(`Error fetching applications for job ${job._id}:`, error);
        }
      }

      setRecentApplications(allApplications.slice(0, 5));
      const pendingApps = allApplications.filter(
        (app) => app.status === 'pending'
      ).length;

      setStats((prev) => ({
        ...prev,
        totalApplications: allApplications.length,
        pendingApplications: pendingApps,
      }));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      if (error.response?.status === 404) {
        // No company found
        setCompany(null);
      } else {
        toast.error('Failed to load dashboard data');
      }
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      icon: FaBriefcase,
      label: 'Total Jobs',
      value: stats.totalJobs,
      bgColor: 'bg-blue-500',
    },
    {
      icon: FaCheckCircle,
      label: 'Active Jobs',
      value: stats.activeJobs,
      bgColor: 'bg-green-500',
    },
    {
      icon: FaUsers,
      label: 'Total Applications',
      value: stats.totalApplications,
      bgColor: 'bg-purple-500',
    },
    {
      icon: FaClock,
      label: 'Pending Reviews',
      value: stats.pendingApplications,
      bgColor: 'bg-yellow-500',
    },
  ];

  if (loading) {
    return (
      <>
        <Navbar />
        <Loader fullScreen />
      </>
    );
  }

  // No company - show setup screen
  if (!company) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FaBuilding className="mx-auto text-gray-300 text-6xl mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome to JobPortal!
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              To start posting jobs and hiring candidates, you need to create your
              company profile first.
            </p>
            <Link
              to="/recruiter/company"
              className="inline-block px-8 py-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-lg font-semibold"
            >
              Create Company Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">{company.name} - Recruiter Dashboard</p>
        </div>

        {/* Company Approval Status */}
        {!company.isApproved && (
          <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <FaClock className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Company Pending Approval
                </h3>
                <p className="mt-2 text-sm text-yellow-700">
                  Your company profile is under review. You can create job postings,
                  but they won't be visible to candidates until your company is
                  approved by our admin team.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} p-4 rounded-lg`}>
                  <stat.icon className="text-white text-2xl" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            to="/recruiter/post-job"
            className="bg-primary-600 text-white rounded-lg shadow-md p-6 hover:bg-primary-700 transition-colors"
          >
            <FaPlus className="text-3xl mb-3" />
            <h3 className="text-xl font-semibold mb-2">Post New Job</h3>
            <p className="text-primary-100">Create a new job posting to attract candidates</p>
          </Link>
          <Link
            to="/recruiter/jobs"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <FaBriefcase className="text-3xl text-primary-600 mb-3" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">My Jobs</h3>
            <p className="text-gray-600">View and manage all your job postings</p>
          </Link>
          <Link
            to="/recruiter/company"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <FaBuilding className="text-3xl text-primary-600 mb-3" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Company Profile
            </h3>
            <p className="text-gray-600">Update your company information</p>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Jobs */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Recent Jobs</h2>
              <Link
                to="/recruiter/jobs"
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                View All →
              </Link>
            </div>

            {recentJobs.length === 0 ? (
              <div className="text-center py-12">
                <FaBriefcase className="mx-auto text-gray-300 text-5xl mb-4" />
                <p className="text-gray-600 mb-4">No jobs posted yet</p>
                <Link
                  to="/recruiter/post-job"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Post your first job →
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentJobs.map((job) => (
                  <div
                    key={job._id}
                    className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <Link
                          to={`/recruiter/jobs/${job._id}/applicants`}
                          className="font-semibold text-gray-900 hover:text-primary-600"
                        >
                          {job.title}
                        </Link>
                        <p className="text-sm text-gray-600">
                          {job.location} • {job.jobType}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
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
                    <p className="text-sm text-gray-500">
                      {job.applicationsCount || 0} applicants • Posted{' '}
                      {formatDate(job.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Applications */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Recent Applications
              </h2>
            </div>

            {recentApplications.length === 0 ? (
              <div className="text-center py-12">
                <FaUsers className="mx-auto text-gray-300 text-5xl mb-4" />
                <p className="text-gray-600">No applications yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentApplications.map((application) => (
                  <div
                    key={application._id}
                    className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {application.applicant?.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          Applied for: {application.job?.title}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          application.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : application.status === 'shortlisted'
                            ? 'bg-blue-100 text-blue-800'
                            : application.status === 'hired'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {application.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      Applied {formatDate(application.appliedDate)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
