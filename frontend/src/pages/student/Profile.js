import React, { useState, useEffect } from 'react';
import { profileAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/common/Navbar';
import ProfileForm from '../../components/student/ProfileForm';
import ResumeUpload from '../../components/student/ResumeUpload';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';
import { FaUser, FaFileAlt } from 'react-icons/fa';

const StudentProfile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'resume'

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await profileAPI.getProfile();
      setProfile(response.data.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (profileData) => {
    try {
      setSaving(true);
      const response = await profileAPI.updateProfile({ profile: profileData });
      setProfile(response.data.data);
      
      // Update user in auth context
      updateUser({ ...user, profile: response.data.data });
      
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUploadSuccess = (updatedProfile) => {
    setProfile(updatedProfile);
    updateUser({ ...user, profile: updatedProfile });
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

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">
            Manage your profile information and resume
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-6 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === 'profile'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <FaUser />
                Profile Information
              </button>
              <button
                onClick={() => setActiveTab('resume')}
                className={`py-4 px-6 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === 'resume'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <FaFileAlt />
                Resume
              </button>
            </nav>
          </div>

          <div className="p-8">
            {activeTab === 'profile' ? (
              <ProfileForm
                profile={profile}
                onSubmit={handleProfileSubmit}
                loading={saving}
              />
            ) : (
              <ResumeUpload
                currentResume={profile?.resume}
                currentResumeName={profile?.resumeOriginalName}
                onUploadSuccess={handleResumeUploadSuccess}
              />
            )}
          </div>
        </div>

        {/* Profile Completion Progress */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Profile Completion
          </h3>
          
          <div className="space-y-3">
            <ProfileCompletionItem
              label="Basic Information"
              completed={!!(user?.name && user?.email)}
            />
            <ProfileCompletionItem
              label="Bio"
              completed={!!profile?.bio}
            />
            <ProfileCompletionItem
              label="Skills"
              completed={!!(profile?.skills && profile.skills.length > 0)}
            />
            <ProfileCompletionItem
              label="Education"
              completed={!!(profile?.education && profile.education.length > 0)}
            />
            <ProfileCompletionItem
              label="Experience"
              completed={!!(profile?.experience && profile.experience.length > 0)}
            />
            <ProfileCompletionItem
              label="Resume"
              completed={!!profile?.resume}
            />
            <ProfileCompletionItem
              label="Social Links"
              completed={!!(profile?.github || profile?.linkedin || profile?.portfolio)}
            />
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                Overall Progress
              </span>
              <span className="text-sm font-medium text-gray-900">
                {calculateProgress(profile, user)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${calculateProgress(profile, user)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component for profile completion items
const ProfileCompletionItem = ({ label, completed }) => (
  <div className="flex items-center justify-between">
    <span className="text-sm text-gray-700">{label}</span>
    <span
      className={`px-2 py-1 text-xs rounded-full ${
        completed
          ? 'bg-green-100 text-green-800'
          : 'bg-gray-100 text-gray-600'
      }`}
    >
      {completed ? 'Completed' : 'Incomplete'}
    </span>
  </div>
);

// Helper function to calculate profile completion percentage
const calculateProgress = (profile, user) => {
  let completed = 0;
  const total = 7;

  if (user?.name && user?.email) completed++;
  if (profile?.bio) completed++;
  if (profile?.skills && profile.skills.length > 0) completed++;
  if (profile?.education && profile.education.length > 0) completed++;
  if (profile?.experience && profile.experience.length > 0) completed++;
  if (profile?.resume) completed++;
  if (profile?.github || profile?.linkedin || profile?.portfolio) completed++;

  return Math.round((completed / total) * 100);
};

export default StudentProfile;
