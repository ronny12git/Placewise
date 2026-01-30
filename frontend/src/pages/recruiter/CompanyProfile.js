import React, { useState, useEffect } from 'react';
import { companyAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/common/Navbar';
import CompanyForm from '../../components/recruiter/CompanyForm';
import Loader from '../../components/common/Loader';
import { isValidImage } from '../../utils/helpers';
import toast from 'react-hot-toast';
import { FaBuilding, FaUpload, FaEdit } from 'react-icons/fa';

const CompanyProfile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [company, setCompany] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchCompany();
  }, []);

  const fetchCompany = async () => {
    try {
      setLoading(true);
      const response = await companyAPI.getMyCompany();
      setCompany(response.data.data);
      setIsEditing(!response.data.data); // Edit mode if no company
    } catch (error) {
      if (error.response?.status === 404) {
        // No company found, stay in edit mode
        setCompany(null);
        setIsEditing(true);
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
      setSaving(true);
      let response;

      if (company) {
        // Update existing company
        response = await companyAPI.updateCompany(company._id, formData);
        toast.success('Company updated successfully');
      } else {
        // Create new company
        response = await companyAPI.createCompany(formData);
        toast.success('Company created successfully! Pending admin approval.');
      }

      setCompany(response.data.data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving company:', error);
      toast.error(error.response?.data?.message || 'Failed to save company');
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!isValidImage(file)) {
      toast.error('Please upload a valid image (JPG, PNG, GIF) under 2MB');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('logo', file);

      const response = await companyAPI.uploadLogo(company._id, formData);
      setCompany(response.data.data);
      toast.success('Logo uploaded successfully');
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast.error(error.response?.data?.message || 'Failed to upload logo');
    } finally {
      setUploading(false);
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

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Company Profile
          </h1>
          <p className="text-gray-600">
            {company
              ? 'Manage your company information'
              : 'Create your company profile to start posting jobs'}
          </p>
        </div>

        {/* Company Status */}
        {company && !company.isApproved && (
          <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
            <h3 className="text-sm font-medium text-yellow-800 mb-2">
              Pending Approval
            </h3>
            <p className="text-sm text-yellow-700">
              Your company profile is under review by our admin team. You can edit
              your information, but it won't be visible to job seekers until
              approved.
            </p>
          </div>
        )}

        {company && company.isApproved && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-6 rounded-lg">
            <h3 className="text-sm font-medium text-green-800 mb-2">
              ✓ Company Approved
            </h3>
            <p className="text-sm text-green-700">
              Your company profile is approved and visible to job seekers.
            </p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md">
          {/* Company Display Mode */}
          {company && !isEditing ? (
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-start space-x-6">
                  {/* Logo */}
                  <div className="relative">
                    {company.logo ? (
                      <img
                        src={company.logo}
                        alt={company.name}
                        className="w-24 h-24 object-contain rounded-lg border border-gray-200"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                        <FaBuilding className="text-gray-400 text-3xl" />
                      </div>
                    )}
                    <label className="absolute -bottom-2 -right-2 cursor-pointer">
                      <div className="bg-primary-600 text-white p-2 rounded-full hover:bg-primary-700 shadow-lg">
                        <FaUpload size={12} />
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        disabled={uploading}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Company Info */}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {company.name}
                    </h2>
                    <p className="text-gray-600 mb-1">{company.location}</p>
                    {company.industry && (
                      <p className="text-sm text-gray-500">{company.industry}</p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 flex items-center gap-2"
                >
                  <FaEdit /> Edit Profile
                </button>
              </div>

              {/* Company Details */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    About
                  </h3>
                  <p className="text-gray-900 whitespace-pre-line">
                    {company.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {company.website && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-1">
                        Website
                      </h3>
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700"
                      >
                        {company.website}
                      </a>
                    </div>
                  )}

                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-1">
                      Company Size
                    </h3>
                    <p className="text-gray-900">{company.companySize} employees</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Edit Mode
            <div className="p-8">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {company ? 'Edit Company Profile' : 'Create Company Profile'}
                </h2>
                <p className="text-sm text-gray-600">
                  Fill in your company details. All fields marked with * are required.
                </p>
              </div>

              <CompanyForm
                company={company}
                onSubmit={handleSubmit}
                loading={saving}
              />

              {company && (
                <div className="mt-4">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;
