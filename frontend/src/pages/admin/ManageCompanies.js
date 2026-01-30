import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import Navbar from '../../components/common/Navbar';
import ApprovalCard from '../../components/admin/ApprovalCard';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';
import { FaBuilding, FaFilter } from 'react-icons/fa';

const ManageCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('pending');

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    filterCompanies();
  }, [statusFilter, companies]);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllCompanies();
      setCompanies(response.data.data || []);
    } catch (error) {
      console.error('Error fetching companies:', error);
      toast.error('Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  const filterCompanies = () => {
    if (statusFilter === 'all') {
      setFilteredCompanies(companies);
    } else if (statusFilter === 'pending') {
      setFilteredCompanies(companies.filter((company) => !company.isApproved));
    } else if (statusFilter === 'approved') {
      setFilteredCompanies(companies.filter((company) => company.isApproved));
    }
  };

  const handleApprove = async (companyId) => {
    try {
      await adminAPI.approveCompany(companyId, { isApproved: true });
      setCompanies(
        companies.map((company) =>
          company._id === companyId ? { ...company, isApproved: true } : company
        )
      );
      toast.success('Company approved successfully');
    } catch (error) {
      console.error('Error approving company:', error);
      toast.error(error.response?.data?.message || 'Failed to approve company');
    }
  };

  const handleReject = async (companyId) => {
    try {
      await adminAPI.approveCompany(companyId, { isApproved: false });
      setCompanies(companies.filter((company) => company._id !== companyId));
      toast.success('Company rejected');
    } catch (error) {
      console.error('Error rejecting company:', error);
      toast.error(error.response?.data?.message || 'Failed to reject company');
    }
  };

  const getStatusCount = (status) => {
    if (status === 'all') return companies.length;
    if (status === 'pending')
      return companies.filter((c) => !c.isApproved).length;
    if (status === 'approved')
      return companies.filter((c) => c.isApproved).length;
    return 0;
  };

  const statusOptions = [
    { value: 'pending', label: 'Pending Approval' },
    { value: 'approved', label: 'Approved' },
    { value: 'all', label: 'All Companies' },
  ];

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Manage Companies
          </h1>
          <p className="text-gray-600">
            Review and approve company registrations
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setStatusFilter(option.value)}
              className={`p-4 rounded-lg border-2 transition-all ${
                statusFilter === option.value
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="text-2xl font-bold text-gray-900">
                {getStatusCount(option.value)}
              </div>
              <div className="text-sm text-gray-600 mt-1">{option.label}</div>
            </button>
          ))}
        </div>

        {/* Filter */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center gap-4">
            <FaFilter className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label} ({getStatusCount(option.value)})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Companies List */}
        {filteredCompanies.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FaBuilding className="mx-auto text-gray-300 text-6xl mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {statusFilter === 'pending'
                ? 'No pending companies'
                : statusFilter === 'approved'
                ? 'No approved companies'
                : 'No companies found'}
            </h3>
            <p className="text-gray-600">
              {statusFilter === 'pending'
                ? 'All companies have been reviewed'
                : 'Companies will appear here once they register'}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4 text-gray-600">
              Showing {filteredCompanies.length}{' '}
              {filteredCompanies.length === 1 ? 'company' : 'companies'}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredCompanies.map((company) => (
                <ApprovalCard
                  key={company._id}
                  item={company}
                  type="company"
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ManageCompanies;
