/**
 * Get the authentication header with the JWT token
 * @returns {Object} Headers object with Authorization token
 */
export const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': token ? `Bearer ${token}` : '',
    'Accept': 'application/json'
  };
};

/**
 * Format error message from API response with fallbacks
 * @param {Error} error - Error object from axios
 * @returns {string} Formatted error message
 */
export const formatErrorMessage = (error) => {
  // Handle API error response
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  
  // Handle validation errors
  if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
    return error.response.data.errors.map(e => e.message).join(', ');
  }
  
  // Handle network errors
  if (error.message === 'Network Error') {
    return 'Network error. Please check your internet connection.';
  }
  
  // Handle timeout
  if (error.code === 'ECONNABORTED') {
    return 'Request timeout. Please try again.';
  }
  
  return error.message || 'An unexpected error occurred. Please try again.';
};

/**
 * Handle API errors and return standardized error object
 * @param {Error} error - Error from API call
 * @returns {Object} Standardized error object
 */
export const handleApiError = (error) => {
  const errorObj = {
    message: formatErrorMessage(error),
    statusCode: error.response?.status || null,
    details: error.response?.data || null,
    isNetworkError: !error.response
  };

  // Log in development mode
  if (process.env.NODE_ENV === 'development') {
    console.error('API Error:', errorObj);
  }

  return errorObj;
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if user is authenticated
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

/**
 * Get user role from localStorage
 * @returns {string|null} User role or null if not authenticated
 */
export const getUserRole = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user.role || null;
};

/**
 * Get current user from localStorage
 * @returns {Object|null} User object or null
 */
export const getCurrentUser = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    return user;
  } catch {
    return null;
  }
};

/**
 * Clear all authentication data
 */
export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('refreshToken');
};

/**
 * Format file size to human readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}; 