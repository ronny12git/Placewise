import React, { useState } from 'react';
import { profileAPI } from '../../services/api';
import { isValidResume } from '../../utils/helpers';
import toast from 'react-hot-toast';
import { FaUpload, FaFile, FaTrash, FaDownload } from 'react-icons/fa';

const ResumeUpload = ({ currentResume, currentResumeName, onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (isValidResume(file)) {
        setSelectedFile(file);
      } else {
        toast.error('Please upload a valid resume (PDF, DOC, DOCX) under 5MB');
        e.target.value = '';
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('resume', selectedFile);

      const response = await profileAPI.uploadResume(formData);
      toast.success('Resume uploaded successfully');
      setSelectedFile(null);
      if (onUploadSuccess) {
        onUploadSuccess(response.data.data);
      }
    } catch (error) {
      console.error('Error uploading resume:', error);
      toast.error(error.response?.data?.message || 'Failed to upload resume');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    // Reset file input
    const fileInput = document.getElementById('resume-upload');
    if (fileInput) fileInput.value = '';
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Resume / CV
        </label>
        
        {/* Current Resume */}
        {currentResume && !selectedFile && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FaFile className="text-green-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {currentResumeName || 'resume.pdf'}
                  </p>
                  <p className="text-xs text-gray-600">Current resume</p>
                </div>
              </div>
              <a
                href={currentResume}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-700"
              >
                <FaDownload />
              </a>
            </div>
          </div>
        )}

        {/* File Input */}
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="resume-upload"
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <FaUpload className="w-8 h-8 mb-3 text-gray-400" />
              <p className="mb-2 text-sm text-gray-600">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                PDF, DOC, or DOCX (MAX. 5MB)
              </p>
            </div>
            <input
              id="resume-upload"
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
            />
          </label>
        </div>

        {/* Selected File */}
        {selectedFile && (
          <div className="mt-4 p-4 bg-primary-50 border border-primary-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FaFile className="text-primary-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-gray-600">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={handleRemove}
                className="text-red-600 hover:text-red-700"
              >
                <FaTrash />
              </button>
            </div>
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="mt-3 w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : 'Upload Resume'}
            </button>
          </div>
        )}
      </div>

      <p className="text-xs text-gray-500">
        Tip: Keep your resume updated to increase your chances of getting hired
      </p>
    </div>
  );
};

export default ResumeUpload;
