// API Configuration Helper
// This file shows all the URLs that need to be updated in the frontend

export const urlMappings = {
  // Main API endpoints
  'https://aaharsetufinal.onrender.com/api': '${config.API_BASE_URL}',
  'https://aaharsetufinal.onrender.com': '${config.BACKEND_URL}',
  
  // ML/AI endpoints  
  'http://127.0.0.1:5001': '${config.ML_API_URL}',
  'http://localhost:5001': '${config.ML_API_URL}',
  'http://localhost:5004': '${config.ML_PREDICT_URL}',
  'http://localhost:5002': '${config.CERTIFICATE_API_URL}',
  'http://localhost:5000': '${config.BACKEND_URL}',
};

// Files that still need updates:
export const filesToUpdate = [
  'src/pages/ngo/dashboard.jsx', // Partially done
  'src/pages/ngo/register.jsx',
  'src/pages/volunteer/dashboard.jsx', 
  'src/pages/volunteer/register.jsx',
  'src/pages/logistic/registration.jsx',
  'src/pages/Recommend.jsx',
  'src/pages/ml_predict.jsx',
  'src/components/layout/CertificateGenerator.jsx',
  'src/components/layout/validationTable.jsx'
];

export default { urlMappings, filesToUpdate };