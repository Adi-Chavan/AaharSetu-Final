// Environment configuration utility
const config = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  BACKEND_URL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000',
  ML_API_URL: import.meta.env.VITE_ML_API_URL || 'http://localhost:5001',
  ML_PREDICT_URL: import.meta.env.VITE_ML_PREDICT_URL || 'http://localhost:5004',
  CERTIFICATE_API_URL: import.meta.env.VITE_CERTIFICATE_API_URL || 'http://localhost:5002'
};

export default config;

  // API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://aaharsetufinal.onrender.com/api',
  // BACKEND_URL: import.meta.env.VITE_BACKEND_URL || 'https://aaharsetufinal.onrender.com'