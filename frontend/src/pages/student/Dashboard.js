import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { applicationAPI, jobAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/common/Navbar';
import Loader from '../../components/common/Loader';
import JobCard from '../../components/common/JobCard';
import toast from 'react-hot-toast';
import {
  FaBriefcase,
  FaFileAlt,
  FaBookmark,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
} from 'react-icons/fa';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [recentApplications, setRecentApplications] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch application stats
      const statsResponse = await applicationAPI.getApplicationStats();
      setStats(statsResponse.data.data);

      // Fetch recent applications
      const appsResponse = await applicationAPI.getMyApplications();
      const applications = appsResponse.data.data || [];
      setRecentApplications(applications.slice(0, 3));

      // Fetch recommended jobs
      try {
        const jobsResponse = await jobAPI.getRecommendedJobs();
        setRecommendedJobs(jobsResponse.data.data?.slice(0, 3) || []);
      } catch (error) {
        // If recommended jobs fail, fetch recent jobs
        const jobsResponse = await jobAPI.getJobs({ limit: 3 });
        setRecommendedJobs(jobsResponse.data.data?.slice(0, 3) || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      icon: FaFileAlt,
      label: 'Total Applications',
      value: stats?.total || 0,
      bgColor: 'bg-blue-500',
    },
    {
      icon: FaClock,
      label: 'Pending',
      value: stats?.pending || 0,
      bgColor: 'bg-yellow-500',
    },
    {
      icon: FaCheckCircle,
      label: 'Shortlisted',
      value: stats?.shortlisted || 0,
      bgColor: 'bg-green-500',
    },
    {
      icon: FaTimesCircle,
      label: 'Rejected',
      value: stats?.rejected || 0,
      bgColor: 'bg-red-500',
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your job search
          </p>
        </div>

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
            to="/jobs"
            className="bg-primary-600 text-white rounded-lg shadow-md p-6 hover:bg-primary-700 transition-colors"
          >
            <FaBriefcase className="text-3xl mb-3" />
            <h3 className="text-xl font-semibold mb-2">Browse Jobs</h3>
            <p className="text-primary-100">
              Discover new opportunities that match your skills
            </p>
          </Link>
          <Link
            to="/student/profile"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <FaFileAlt className="text-3xl text-primary-600 mb-3" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Update Profile
            </h3>
            <p className="text-gray-600">
              Keep your profile updated to attract recruiters
            </p>
          </Link>
          <Link
            to="/student/saved-jobs"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <FaBookmark className="text-3xl text-primary-600 mb-3" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Saved Jobs
            </h3>
            <p className="text-gray-600">
              View jobs you've bookmarked for later
            </p>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Applications */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Recent Applications
              </h2>
              <Link
                to="/student/applications"
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                View All →
              </Link>
            </div>

            {recentApplications.length === 0 ? (
              <div className="text-center py-12">
                <FaFileAlt className="mx-auto text-gray-300 text-5xl mb-4" />
                <p className="text-gray-600 mb-4">No applications yet</p>
                <Link
                  to="/jobs"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Start applying to jobs →
                </Link>
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
                        <Link
                          to={`/jobs/${application.job._id}`}
                          className="font-semibold text-gray-900 hover:text-primary-600"
                        >
                          {application.job.title}
                        </Link>
                        <p className="text-sm text-gray-600">
                          {application.company?.name}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          application.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : application.status === 'shortlisted'
                            ? 'bg-green-100 text-green-800'
                            : application.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {application.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      Applied on{' '}
                      {new Date(application.appliedDate).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recommended Jobs */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Recommended for You
              </h2>
              <Link
                to="/jobs"
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                View All →
              </Link>
            </div>

            {recommendedJobs.length === 0 ? (
              <div className="text-center py-12">
                <FaBriefcase className="mx-auto text-gray-300 text-5xl mb-4" />
                <p className="text-gray-600 mb-2">No recommendations yet</p>
                <p className="text-sm text-gray-500">
                  Update your profile with skills to get personalized job
                  recommendations
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {recommendedJobs.map((job) => (
                  <div
                    key={job._id}
                    className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors"
                  >
                    <Link
                      to={`/jobs/${job._id}`}
                      className="font-semibold text-gray-900 hover:text-primary-600 block mb-1"
                    >
                      {job.title}
                    </Link>
                    <p className="text-sm text-gray-600 mb-2">
                      {job.company?.name} • {job.location}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {job.skills?.slice(0, 3).map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Profile Completion Reminder */}
        {(!user?.profile?.resume || !user?.profile?.skills?.length) && (
          <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Complete Your Profile
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    {!user?.profile?.resume &&
                      'Upload your resume to start applying for jobs. '}
                    {!user?.profile?.skills?.length &&
                      'Add skills to your profile to get better job recommendations. '}
                  </p>
                </div>
                <div className="mt-4">
                  <Link
                    to="/student/profile"
                    className="text-sm font-medium text-yellow-800 hover:text-yellow-900"
                  >
                    Complete Profile →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
