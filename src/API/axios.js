import axios from 'axios';

const axiosBase = axios.create({
    baseURL: 'https://evangadi-forum-backend-4wku.onrender.com/api',  
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
});

export default axiosBase;

