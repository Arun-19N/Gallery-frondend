// // src/feature/auth/authService.js
// import api from '../../src/utils/api.js';

// // Register user
// const register = async (data) => {
//   const response = await api.post('/auth/register', data);
//   return response.data;
// };

// // Login user
// const login = async (data) => {
//   const response = await api.post('/auth/login', data);
//   return response.data;
// };

// // Get current logged-in user
// const getMe = async () => {
//   const response = await api.get('/auth/me'); // 🍪 must send cookie
//   return response.data;
// };

// // Logout the user
// const logout = async () => {
//   const response = await api.post('/auth/logout');
//   return response.data;
// };

// export default { register, login, logout, getMe };


// src/feature/auth/authService.js
import api from '../../src/utils/api.js'; // ✅ Axios instance with withCredentials

// Register user
const register = async (data) => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

// Login user
const login = async (data) => {
  const response = await api.post('/auth/login', data);
  return response.data;
};

// Get current logged-in user
const getMe = async () => {
  const response = await api.get('/auth/me'); // auto-sends cookie if `withCredentials: true`
  return response.data;
};

// Logout user
const logout = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};

export default { register, login, logout, getMe };
