import axios from 'axios';

const axiosBase = axios.create({
  baseURL:'https://evangadi-forum-backend-4wku.onrender.com/api',
  // baseURL: 'http://localhost:5000/api', // Ensure this matches the backend's base URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosBase;

