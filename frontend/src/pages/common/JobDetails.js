import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { jobAPI, applicationAPI, savedJobAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import { formatDate, formatSalary } from '../../utils/helpers';
import toast from 'react-hot-toast';
import {
  FaMapMarkerAlt,
  FaBriefcase,
  FaClock,
  FaDollarSign,
  FaBuilding,
  FaUsers,
  FaBookmark,
  FaRegBookmark,
  FaArrowLeft,
} from 'react-icons/fa';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isStudent } = useAuth();
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    fetchJobDetails();
    if (isStudent) {
      checkSavedStatus();
      checkApplicationStatus();
    }
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const response = await jobAPI.getJob(id);
      setJob(response.data.data);
    } catch (error) {
      console.error('Error fetching job details:', error);
      toast.error('Failed to load job details');
      navigate('/jobs');
    } finally {
      setLoading(false);
    }
  };

  const checkSavedStatus = async () => {
    try {
      const response = await savedJobAPI.checkSavedJob(id);
      setIsSaved(response.data.isSaved);
    } catch (error) {
      console.error('Error checking saved status:', error);
    }
  };

  const checkApplicationStatus = async () => {
    try {
      const response = await applicationAPI.getMyApplications();
      const applications = response.data.data || [];
      const applied = applications.some(app => app.job._id === id);
      setHasApplied(applied);
    } catch (error) {
      console.error('Error checking application status:', error);
    }
  };

  const handleSaveJob = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to save jobs');
      navigate('/login');
      return;
    }

    if (!isStudent) {
      toast.error('Only students can save jobs');
      return;
    }

    try {
      if (isSaved) {
        await savedJobAPI.unsaveJob(id);
        setIsSaved(false);
        toast.success('Job removed from saved');
      } else {
        await savedJobAPI.saveJob(id);
        setIsSaved(true);
        toast.success('Job saved successfully');
      }
    } catch (error) {
      console.error('Error saving job:', error);
      toast.error(error.response?.data?.message || 'Failed to save job');
    }
  };

  const handleApply = () => {
    if (!isAuthenticated) {
      toast.error('Please login to apply for jobs');
      navigate('/login');
      return;
    }

    if (!isStudent) {
      toast.error('Only students can apply for jobs');
      return;
    }

    if (hasApplied) {
      toast.error('You have already applied for this job');
      return;
    }

    if (!user?.profile?.resume) {
      toast.error('Please upload your resume in your profile first');
      navigate('/student/profile');
      return;
    }

    setShowApplyModal(true);
  };

  const submitApplication = async () => {
    try {
      setApplying(true);
      await applicationAPI.applyForJob(id, { coverLetter });
      toast.success('Application submitted successfully!');
      setHasApplied(true);
      setShowApplyModal(false);
      setCoverLetter('');
    } catch (error) {
      console.error('Error applying for job:', error);
      toast.error(error.response?.data?.message || 'Failed to submit application');
    } finally {
      setApplying(false);
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

  if (!job) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Job not found</h2>
            <Link to="/jobs" className="text-primary-600 hover:text-primary-700">
              Browse all jobs
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
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <FaArrowLeft className="mr-2" />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-8">
              {/* Job Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start space-x-4">
                  {job.company?.logo && (
                    <img
                      src={job.company.logo}
                      alt={job.company.name}
                      className="w-20 h-20 object-contain rounded-lg"
                    />
                  )}
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {job.title}
                    </h1>
                    <Link
                      to={`/companies/${job.company._id}`}
                      className="text-xl text-gray-600 hover:text-primary-600"
                    >
                      {job.company?.name}
                    </Link>
                  </div>
                </div>
                {isStudent && (
                  <button
                    onClick={handleSaveJob}
                    className="text-gray-400 hover:text-primary-600 transition-colors"
                  >
                    {isSaved ? <FaBookmark size={24} /> : <FaRegBookmark size={24} />}
                  </button>
                )}
              </div>

              {/* Job Info */}
              <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center text-gray-700">
                  <FaMapMarkerAlt className="mr-3 text-primary-600" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <FaBriefcase className="mr-3 text-primary-600" />
                  <span>{job.jobType}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <FaDollarSign className="mr-3 text-primary-600" />
                  <span>{formatSalary(job.salary?.min, job.salary?.max, job.salaryType)}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <FaClock className="mr-3 text-primary-600" />
                  <span>Posted {formatDate(job.createdAt)}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <FaUsers className="mr-3 text-primary-600" />
                  <span>{job.experienceLevel}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <FaBuilding className="mr-3 text-primary-600" />
                  <span>{job.positions} position{job.positions > 1 ? 's' : ''}</span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Description</h2>
                <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
              </div>

              {/* Requirements */}
              {job.requirements && job.requirements.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Requirements</h2>
                  <ul className="list-disc list-inside space-y-2">
                    {job.requirements.map((req, index) => (
                      <li key={index} className="text-gray-700">{req}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Responsibilities */}
              {job.responsibilities && job.responsibilities.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Responsibilities</h2>
                  <ul className="list-disc list-inside space-y-2">
                    {job.responsibilities.map((resp, index) => (
                      <li key={index} className="text-gray-700">{resp}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Skills */}
              {job.skills && job.skills.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Required Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-primary-50 text-primary-700 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <div className="mb-6">
                <div className="text-sm text-gray-600 mb-2">Application Deadline</div>
                <div className="text-lg font-semibold text-gray-900">
                  {formatDate(job.applicationDeadline)}
                </div>
              </div>

              <div className="mb-6">
                <div className="text-sm text-gray-600 mb-2">Applicants</div>
                <div className="text-lg font-semibold text-gray-900">
                  {job.applicationsCount || 0} applicants
                </div>
              </div>

              {isStudent && (
                <button
                  onClick={handleApply}
                  disabled={hasApplied}
                  className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                    hasApplied
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      : 'bg-primary-600 text-white hover:bg-primary-700'
                  }`}
                >
                  {hasApplied ? 'Already Applied' : 'Apply Now'}
                </button>
              )}

              {!isAuthenticated && (
                <Link
                  to="/login"
                  className="block w-full py-3 bg-primary-600 text-white rounded-lg font-semibold text-center hover:bg-primary-700 transition-colors"
                >
                  Login to Apply
                </Link>
              )}

              {/* Company Info */}
              {job.company && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    About the Company
                  </h3>
                  <p className="text-gray-700 mb-4 line-clamp-3">
                    {job.company.description}
                  </p>
                  {job.company.website && (
                    <a
                      href={job.company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700"
                    >
                      Visit Website →
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      <Modal
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        title="Apply for Job"
        size="medium"
      >
        <div className="space-y-4">
          <div>
            <p className="text-gray-700 mb-4">
              You are applying for <strong>{job.title}</strong> at{' '}
              <strong>{job.company?.name}</strong>
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Your profile and resume will be shared with the employer.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cover Letter (Optional)
            </label>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows="6"
              placeholder="Write a cover letter to introduce yourself..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={() => setShowApplyModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={submitApplication}
              disabled={applying}
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
            >
              {applying ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </div>
      </Modal>

      <Footer />
    </div>
  );
};

export default JobDetails;
