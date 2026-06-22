// src/utils/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://gallery-backend-five.vercel.app/api',
  withCredentials: true,
});

export default api;