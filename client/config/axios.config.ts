import axios from 'axios'
import config from './config'

export const Fetch = axios.create({
    baseURL: config.serverOrigin,
    withCredentials: true,
    withXSRFToken: true,
    xsrfCookieName: 'csrf-token',
    xsrfHeaderName: 'x-csrf-token'
})

export const Api = axios.create({
    baseURL: config.clientOrigin,   
})

Fetch.interceptors.request.use((config) => {

  return config;
});