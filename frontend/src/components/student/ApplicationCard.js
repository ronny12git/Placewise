import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate, getStatusColor } from '../../utils/helpers';
import { FaBuilding, FaMapMarkerAlt, FaClock } from 'react-icons/fa';

const ApplicationCard = ({ application }) => {
  const { job, company, status, appliedDate, coverLetter } = application;

  const statusText = {
    pending: 'Under Review',
    shortlisted: 'Shortlisted',
    interview: 'Interview Scheduled',
    rejected: 'Not Selected',
    hired: 'Hired',
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start space-x-4">
          {company?.logo && (
            <img
              src={company.logo}
              alt={company.name}
              className="w-16 h-16 object-contain rounded-lg"
            />
          )}
          <div>
            <Link
              to={`/jobs/${job._id}`}
              className="text-xl font-semibold text-gray-900 hover:text-primary-600"
            >
              {job.title}
            </Link>
            <p className="text-gray-600 mt-1">{company?.name || 'Company'}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
          {statusText[status] || status}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        <div className="flex items-center text-gray-600 text-sm">
          <FaMapMarkerAlt className="mr-2 text-primary-600" />
          {job.location}
        </div>
        <div className="flex items-center text-gray-600 text-sm">
          <FaClock className="mr-2 text-primary-600" />
          Applied {formatDate(appliedDate)}
        </div>
        <div className="flex items-center text-gray-600 text-sm">
          <FaBuilding className="mr-2 text-primary-600" />
          {job.jobType}
        </div>
      </div>

      {coverLetter && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Cover Letter:</p>
          <p className="text-sm text-gray-700 line-clamp-2">{coverLetter}</p>
        </div>
      )}

      <div className="mt-4 flex gap-3">
        <Link
          to={`/jobs/${job._id}`}
          className="flex-1 px-4 py-2 text-center border border-primary-600 text-primary-600 rounded-md hover:bg-primary-50 transition-colors"
        >
          View Job
        </Link>
      </div>
    </div>
  );
};

export default ApplicationCard;
