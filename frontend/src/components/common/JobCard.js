import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaMapMarkerAlt, 
  FaBriefcase, 
  FaClock, 
  FaDollarSign,
  FaBookmark,
  FaRegBookmark 
} from 'react-icons/fa';
import { format } from 'date-fns';

const JobCard = ({ job, onSave, isSaved }) => {
  const formatSalary = () => {
    if (job.salary?.min && job.salary?.max) {
      return `₹${job.salary.min.toLocaleString()} - ₹${job.salary.max.toLocaleString()} ${job.salaryType}`;
    }
    return 'Salary not disclosed';
  };

  const formatDate = (date) => {
    try {
      return format(new Date(date), 'MMM dd, yyyy');
    } catch (error) {
      return 'N/A';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start space-x-4">
          {job.company?.logo && (
            <img
              src={job.company.logo}
              alt={job.company.name}
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
            <p className="text-gray-600 mt-1">{job.company?.name || 'Company Name'}</p>
          </div>
        </div>
        
        {onSave && (
          <button
            onClick={() => onSave(job._id)}
            className="text-gray-400 hover:text-primary-600 transition-colors"
          >
            {isSaved ? <FaBookmark size={20} /> : <FaRegBookmark size={20} />}
          </button>
        )}
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-gray-600 text-sm">
          <FaMapMarkerAlt className="mr-2 text-primary-600" />
          {job.location}
        </div>
        <div className="flex items-center text-gray-600 text-sm">
          <FaBriefcase className="mr-2 text-primary-600" />
          {job.jobType} • {job.experienceLevel}
        </div>
        <div className="flex items-center text-gray-600 text-sm">
          <FaDollarSign className="mr-2 text-primary-600" />
          {formatSalary()}
        </div>
        <div className="flex items-center text-gray-600 text-sm">
          <FaClock className="mr-2 text-primary-600" />
          Posted {formatDate(job.createdAt)}
        </div>
      </div>

      {job.skills && job.skills.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {job.skills.slice(0, 5).map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-primary-50 text-primary-700 text-xs rounded-full"
              >
                {skill}
              </span>
            ))}
            {job.skills.length > 5 && (
              <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{job.skills.length - 5} more
              </span>
            )}
          </div>
        </div>
      )}

      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>{job.applicationsCount || 0} applicants</span>
          <span className="text-gray-300">|</span>
          <span>Deadline: {formatDate(job.applicationDeadline)}</span>
        </div>
        <Link
          to={`/jobs/${job._id}`}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors text-sm font-medium"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default JobCard;
