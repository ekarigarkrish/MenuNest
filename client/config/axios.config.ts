import axios from 'axios'
import config from './config'

export const Fetch = axios.create({
    baseURL: config.serverOrigin,
    withCredentials: true,
    withXSRFToken: true,
    xsrfCookieName: 'csrf-token', // Let Axios automatically read this non-HttpOnly cookie
    xsrfHeaderName: 'x-csrf-token' // Let Axios automatically append this header
})

export const fetchCsrfToken = async () => {
    try {
        await Fetch.get('/api/get/csrf-token');
    } catch (error) {
        console.error('Failed to fetch CSRF token:', error);
        return null;
    }
};

Fetch.interceptors.request.use((config) => {

  return config;
});