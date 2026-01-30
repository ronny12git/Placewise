import React, { useState } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';

const JobForm = ({ job, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    title: job?.title || '',
    description: job?.description || '',
    requirements: job?.requirements || [],
    responsibilities: job?.responsibilities || [],
    salary: {
      min: job?.salary?.min || '',
      max: job?.salary?.max || '',
    },
    salaryType: job?.salaryType || 'Yearly',
    location: job?.location || '',
    jobType: job?.jobType || 'Full-time',
    experienceLevel: job?.experienceLevel || 'Entry Level',
    skills: job?.skills || [],
    positions: job?.positions || 1,
    applicationDeadline: job?.applicationDeadline
      ? new Date(job.applicationDeadline).toISOString().split('T')[0]
      : '',
  });

  const [newRequirement, setNewRequirement] = useState('');
  const [newResponsibility, setNewResponsibility] = useState('');
  const [newSkill, setNewSkill] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('salary.')) {
      const salaryField = name.split('.')[1];
      setFormData({
        ...formData,
        salary: { ...formData.salary, [salaryField]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setFormData({
        ...formData,
        requirements: [...formData.requirements, newRequirement.trim()],
      });
      setNewRequirement('');
    }
  };

  const removeRequirement = (index) => {
    setFormData({
      ...formData,
      requirements: formData.requirements.filter((_, i) => i !== index),
    });
  };

  const addResponsibility = () => {
    if (newResponsibility.trim()) {
      setFormData({
        ...formData,
        responsibilities: [...formData.responsibilities, newResponsibility.trim()],
      });
      setNewResponsibility('');
    }
  };

  const removeResponsibility = (index) => {
    setFormData({
      ...formData,
      responsibilities: formData.responsibilities.filter((_, i) => i !== index),
    });
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill.trim()],
      });
      setNewSkill('');
    }
  };

  const removeSkill = (index) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      salary: {
        min: parseInt(formData.salary.min) || 0,
        max: parseInt(formData.salary.max) || 0,
      },
      positions: parseInt(formData.positions) || 1,
    };
    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Job Title *
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="e.g. Senior Software Engineer"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Job Description *
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows="6"
          placeholder="Describe the role, responsibilities, and what you're looking for..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      {/* Location, Job Type, Experience Level */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location *
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            placeholder="e.g. Mumbai, Remote"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Type *
          </label>
          <select
            name="jobType"
            value={formData.jobType}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Experience Level *
          </label>
          <select
            name="experienceLevel"
            value={formData.experienceLevel}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="Fresher">Fresher</option>
            <option value="Entry Level">Entry Level</option>
            <option value="Mid Level">Mid Level</option>
            <option value="Senior Level">Senior Level</option>
          </select>
        </div>
      </div>

      {/* Salary */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Salary Range
        </label>
        <div className="grid grid-cols-3 gap-4">
          <input
            type="number"
            name="salary.min"
            value={formData.salary.min}
            onChange={handleChange}
            placeholder="Min (₹)"
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
          <input
            type="number"
            name="salary.max"
            value={formData.salary.max}
            onChange={handleChange}
            placeholder="Max (₹)"
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
          <select
            name="salaryType"
            value={formData.salaryType}
            onChange={handleChange}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="Monthly">Monthly</option>
            <option value="Yearly">Yearly</option>
          </select>
        </div>
      </div>

      {/* Requirements */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Requirements *
        </label>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newRequirement}
            onChange={(e) => setNewRequirement(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
            placeholder="Add a requirement"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
          <button
            type="button"
            onClick={addRequirement}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            <FaPlus />
          </button>
        </div>
        <ul className="space-y-2">
          {formData.requirements.map((req, index) => (
            <li
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
            >
              <span className="text-sm text-gray-700">{req}</span>
              <button
                type="button"
                onClick={() => removeRequirement(index)}
                className="text-red-600 hover:text-red-700"
              >
                <FaTrash size={14} />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Responsibilities */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Responsibilities
        </label>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newResponsibility}
            onChange={(e) => setNewResponsibility(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addResponsibility())}
            placeholder="Add a responsibility"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
          <button
            type="button"
            onClick={addResponsibility}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            <FaPlus />
          </button>
        </div>
        <ul className="space-y-2">
          {formData.responsibilities.map((resp, index) => (
            <li
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
            >
              <span className="text-sm text-gray-700">{resp}</span>
              <button
                type="button"
                onClick={() => removeResponsibility(index)}
                className="text-red-600 hover:text-red-700"
              >
                <FaTrash size={14} />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Skills */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Required Skills
        </label>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
            placeholder="Add a skill"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
          <button
            type="button"
            onClick={addSkill}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            <FaPlus />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.skills.map((skill, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-2 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(index)}
                className="text-primary-600 hover:text-primary-800"
              >
                <FaTrash size={12} />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Positions and Deadline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Positions *
          </label>
          <input
            type="number"
            name="positions"
            value={formData.positions}
            onChange={handleChange}
            min="1"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Application Deadline *
          </label>
          <input
            type="date"
            name="applicationDeadline"
            value={formData.applicationDeadline}
            onChange={handleChange}
            required
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : job ? 'Update Job' : 'Post Job'}
        </button>
      </div>
    </form>
  );
};

export default JobForm;
