import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API1_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})

export const apiJWT = axios.create({
    baseURL: import.meta.env.VITE_API2_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})

apiJWT.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

