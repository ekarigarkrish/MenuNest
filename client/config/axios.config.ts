import axios from 'axios'
import config from './config'

export const Fetch = axios.create({
    baseURL: config.serverOrigin,
    xsrfCookieName: 'csrf-token', // Let Axios automatically read this non-HttpOnly cookie
    xsrfHeaderName: 'x-csrf-token' // Let Axios automatically append this header
})

Fetch.interceptors.request.use((config) => {

  return config;
});