import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { companyAPI, jobAPI } from '../../services/api';
import Navbar from '../../components/common/Navbar';
import JobForm from '../../components/recruiter/JobForm';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';
import { FaBuilding } from 'react-icons/fa';

const PostJob = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [company, setCompany] = useState(null);

  useEffect(() => {
    checkCompany();
  }, []);

  const checkCompany = async () => {
    try {
      setLoading(true);
      const response = await companyAPI.getMyCompany();
      setCompany(response.data.data);
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error('Please create your company profile first');
        navigate('/recruiter/company');
      } else {
        console.error('Error fetching company:', error);
        toast.error('Failed to load company');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setPosting(true);
      await jobAPI.createJob(formData);
      toast.success(
        company.isApproved
          ? 'Job posted successfully!'
          : 'Job created! It will be visible after admin approval.'
      );
      navigate('/recruiter/jobs');
    } catch (error) {
      console.error('Error posting job:', error);
      toast.error(error.response?.data?.message || 'Failed to post job');
    } finally {
      setPosting(false);
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

  if (!company) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FaBuilding className="mx-auto text-gray-300 text-6xl mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Company Profile Required
            </h2>
            <p className="text-gray-600 mb-6">
              You need to create your company profile before posting jobs.
            </p>
            <button
              onClick={() => navigate('/recruiter/company')}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Create Company Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Post a New Job
          </h1>
          <p className="text-gray-600">
            Fill in the details below to create a new job posting
          </p>
        </div>

        {/* Company not approved warning */}
        {!company.isApproved && (
          <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
            <h3 className="text-sm font-medium text-yellow-800 mb-2">
              Company Pending Approval
            </h3>
            <p className="text-sm text-yellow-700">
              Your company is pending approval. You can create job postings, but they
              won't be visible to candidates until your company is approved by admin.
            </p>
          </div>
        )}

        {/* Job Form */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <JobForm onSubmit={handleSubmit} loading={posting} />
        </div>

        {/* Tips */}
        <div className="mt-6 bg-blue-50 border-l-4 border-blue-400 p-6 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800 mb-2">
            Tips for a Great Job Posting
          </h3>
          <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
            <li>Write a clear and specific job title</li>
            <li>Include detailed responsibilities and requirements</li>
            <li>Specify required skills and experience level</li>
            <li>Mention salary range to attract quality candidates</li>
            <li>Set a reasonable application deadline</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PostJob;
