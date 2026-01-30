// Date formatting helper
export const formatDate = (date) => {
  if (!date) return 'N/A';
  try {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  } catch (error) {
    return 'N/A';
  }
};

// Format salary
export const formatSalary = (min, max, type = 'Yearly') => {
  if (!min && !max) return 'Not disclosed';
  if (min && max) {
    return `₹${min.toLocaleString()} - ₹${max.toLocaleString()} ${type}`;
  }
  if (min) return `₹${min.toLocaleString()}+ ${type}`;
  return `Up to ₹${max.toLocaleString()} ${type}`;
};

// Truncate text
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Get status color
export const getStatusColor = (status) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    shortlisted: 'bg-blue-100 text-blue-800',
    interview: 'bg-purple-100 text-purple-800',
    rejected: 'bg-red-100 text-red-800',
    hired: 'bg-green-100 text-green-800',
    active: 'bg-green-100 text-green-800',
    closed: 'bg-gray-100 text-gray-800',
  };
  return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
};

// Validate email
export const isValidEmail = (email) => {
  return /\S+@\S+\.\S+/.test(email);
};

// Validate phone
export const isValidPhone = (phone) => {
  return /^[0-9]{10}$/.test(phone);
};

// Get file extension
export const getFileExtension = (filename) => {
  return filename.split('.').pop().toLowerCase();
};

// Check if file is valid resume
export const isValidResume = (file) => {
  const validExtensions = ['pdf', 'doc', 'docx'];
  const extension = getFileExtension(file.name);
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  return validExtensions.includes(extension) && file.size <= maxSize;
};

// Check if file is valid image
export const isValidImage = (file) => {
  const validExtensions = ['jpg', 'jpeg', 'png', 'gif'];
  const extension = getFileExtension(file.name);
  const maxSize = 2 * 1024 * 1024; // 2MB
  
  return validExtensions.includes(extension) && file.size <= maxSize;
};
