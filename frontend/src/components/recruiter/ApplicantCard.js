import React, { useState } from 'react';
import { formatDate, getStatusColor } from '../../utils/helpers';
import { FaEnvelope, FaPhone, FaDownload, FaGithub, FaLinkedin, FaGlobe } from 'react-icons/fa';

const ApplicantCard = ({ application, onUpdateStatus }) => {
  const { applicant, status, appliedDate, coverLetter, resume } = application;
  const [selectedStatus, setSelectedStatus] = useState(status);
  const [updating, setUpdating] = useState(false);

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'shortlisted', label: 'Shortlisted' },
    { value: 'interview', label: 'Interview' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'hired', label: 'Hired' },
  ];

  const handleStatusUpdate = async () => {
    if (selectedStatus === status) return;
    
    setUpdating(true);
    await onUpdateStatus(application._id, selectedStatus);
    setUpdating(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            {applicant.name}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Applied on {formatDate(appliedDate)}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
          {status}
        </span>
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        {applicant.email && (
          <div className="flex items-center text-gray-700">
            <FaEnvelope className="mr-2 text-primary-600" />
            <a href={`mailto:${applicant.email}`} className="hover:text-primary-600">
              {applicant.email}
            </a>
          </div>
        )}
        {applicant.phone && (
          <div className="flex items-center text-gray-700">
            <FaPhone className="mr-2 text-primary-600" />
            <a href={`tel:${applicant.phone}`} className="hover:text-primary-600">
              {applicant.phone}
            </a>
          </div>
        )}
      </div>

      {/* Bio */}
      {applicant.profile?.bio && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">About</h4>
          <p className="text-sm text-gray-700">{applicant.profile.bio}</p>
        </div>
      )}

      {/* Skills */}
      {applicant.profile?.skills && applicant.profile.skills.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Skills</h4>
          <div className="flex flex-wrap gap-2">
            {applicant.profile.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-primary-50 text-primary-700 text-xs rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {applicant.profile?.education && applicant.profile.education.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Education</h4>
          <div className="space-y-2">
            {applicant.profile.education.map((edu, index) => (
              <div key={index} className="text-sm">
                <p className="font-medium text-gray-900">{edu.degree}</p>
                <p className="text-gray-600">
                  {edu.institution} • {edu.year}
                  {edu.percentage && ` • ${edu.percentage}%`}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {applicant.profile?.experience && applicant.profile.experience.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Experience</h4>
          <div className="space-y-3">
            {applicant.profile.experience.map((exp, index) => (
              <div key={index} className="text-sm">
                <p className="font-medium text-gray-900">{exp.title}</p>
                <p className="text-gray-600">
                  {exp.company} • {exp.duration}
                </p>
                {exp.description && (
                  <p className="text-gray-700 mt-1">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cover Letter */}
      {coverLetter && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Cover Letter</h4>
          <p className="text-sm text-gray-700 whitespace-pre-line">{coverLetter}</p>
        </div>
      )}

      {/* Social Links */}
      <div className="flex flex-wrap gap-3 mb-4">
        {applicant.profile?.github && (
          <a
            href={applicant.profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-gray-600 hover:text-primary-600"
          >
            <FaGithub className="mr-1" /> GitHub
          </a>
        )}
        {applicant.profile?.linkedin && (
          <a
            href={applicant.profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-gray-600 hover:text-primary-600"
          >
            <FaLinkedin className="mr-1" /> LinkedIn
          </a>
        )}
        {applicant.profile?.portfolio && (
          <a
            href={applicant.profile.portfolio}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-gray-600 hover:text-primary-600"
          >
            <FaGlobe className="mr-1" /> Portfolio
          </a>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <div className="flex-1">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleStatusUpdate}
          disabled={selectedStatus === status || updating}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {updating ? 'Updating...' : 'Update Status'}
        </button>
        {resume && (
          <a
            href={resume}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 border border-primary-600 text-primary-600 rounded-md hover:bg-primary-50 flex items-center gap-2"
          >
            <FaDownload /> Resume
          </a>
        )}
      </div>
    </div>
  );
};

export default ApplicantCard;
