import React, { useState } from 'react';
import { formatDate } from '../../utils/helpers';
import { FaCheck, FaTimes, FaBuilding, FaBriefcase } from 'react-icons/fa';

const ApprovalCard = ({ item, type, onApprove, onReject }) => {
  const [processing, setProcessing] = useState(false);

  const handleApprove = async () => {
    setProcessing(true);
    await onApprove(item._id);
    setProcessing(false);
  };

  const handleReject = async () => {
    if (!window.confirm(`Are you sure you want to reject this ${type}?`)) {
      return;
    }
    setProcessing(true);
    await onReject(item._id);
    setProcessing(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-gray-100 rounded-lg">
            {type === 'company' ? (
              item.logo ? (
                <img src={item.logo} alt={item.name} className="w-12 h-12 object-contain" />
              ) : (
                <FaBuilding className="text-gray-400 text-2xl" />
              )
            ) : (
              <FaBriefcase className="text-gray-400 text-2xl" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {type === 'company' ? item.name : item.title}
            </h3>
            <p className="text-sm text-gray-600">
              {type === 'company' ? item.location : `${item.company?.name} • ${item.location}`}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Submitted {formatDate(item.createdAt)}
            </p>
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            item.isApproved
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {item.isApproved ? 'Approved' : 'Pending'}
        </span>
      </div>

      {/* Details */}
      <div className="mb-4">
        <p className="text-sm text-gray-700 line-clamp-3">{item.description}</p>
      </div>

      {/* Company-specific fields */}
      {type === 'company' && (
        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
          {item.industry && (
            <div>
              <span className="text-gray-600">Industry:</span>
              <span className="ml-2 text-gray-900">{item.industry}</span>
            </div>
          )}
          {item.companySize && (
            <div>
              <span className="text-gray-600">Size:</span>
              <span className="ml-2 text-gray-900">{item.companySize} employees</span>
            </div>
          )}
          {item.website && (
            <div className="col-span-2">
              <span className="text-gray-600">Website:</span>
              <a
                href={item.website}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-primary-600 hover:text-primary-700"
              >
                {item.website}
              </a>
            </div>
          )}
        </div>
      )}

      {/* Job-specific fields */}
      {type === 'job' && (
        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
          <div>
            <span className="text-gray-600">Type:</span>
            <span className="ml-2 text-gray-900">{item.jobType}</span>
          </div>
          <div>
            <span className="text-gray-600">Experience:</span>
            <span className="ml-2 text-gray-900">{item.experienceLevel}</span>
          </div>
          <div>
            <span className="text-gray-600">Positions:</span>
            <span className="ml-2 text-gray-900">{item.positions}</span>
          </div>
          <div>
            <span className="text-gray-600">Deadline:</span>
            <span className="ml-2 text-gray-900">{formatDate(item.applicationDeadline)}</span>
          </div>
          {item.skills && item.skills.length > 0 && (
            <div className="col-span-2">
              <span className="text-gray-600">Skills:</span>
              <div className="mt-1 flex flex-wrap gap-1">
                {item.skills.slice(0, 5).map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-full"
                  >
                    {skill}
                  </span>
                ))}
                {item.skills.length > 5 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    +{item.skills.length - 5} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      {!item.isApproved && (
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={handleApprove}
            disabled={processing}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <FaCheck /> Approve
          </button>
          <button
            onClick={handleReject}
            disabled={processing}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <FaTimes /> Reject
          </button>
        </div>
      )}

      {item.isApproved && (
        <div className="pt-4 border-t border-gray-200 text-center text-sm text-gray-600">
          This {type} has been approved
        </div>
      )}
    </div>
  );
};

export default ApprovalCard;
