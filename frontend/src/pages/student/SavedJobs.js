import React, { useState, useEffect } from 'react';
import { savedJobAPI } from '../../services/api';
import Navbar from '../../components/common/Navbar';
import JobCard from '../../components/common/JobCard';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';
import { FaBookmark } from 'react-icons/fa';

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    try {
      setLoading(true);
      const response = await savedJobAPI.getSavedJobs();
      setSavedJobs(response.data.data || []);
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
      toast.error('Failed to load saved jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsaveJob = async (jobId) => {
    try {
      await savedJobAPI.unsaveJob(jobId);
      setSavedJobs(savedJobs.filter((item) => item.job._id !== jobId));
      toast.success('Job removed from saved');
    } catch (error) {
      console.error('Error removing saved job:', error);
      toast.error(error.response?.data?.message || 'Failed to remove job');
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Saved Jobs</h1>
          <p className="text-gray-600">
            Jobs you've bookmarked for later
          </p>
        </div>

        {/* Jobs List */}
        {savedJobs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FaBookmark className="mx-auto text-gray-300 text-6xl mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No saved jobs yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start bookmarking jobs you're interested in to save them for later
            </p>
            <a
              href="/jobs"
              className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Browse Jobs
            </a>
          </div>
        ) : (
          <>
            <div className="mb-4 text-gray-600">
              {savedJobs.length} saved {savedJobs.length === 1 ? 'job' : 'jobs'}
            </div>
            <div className="space-y-4">
              {savedJobs.map((item) => (
                <JobCard
                  key={item._id}
                  job={item.job}
                  onSave={handleUnsaveJob}
                  isSaved={true}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SavedJobs;
