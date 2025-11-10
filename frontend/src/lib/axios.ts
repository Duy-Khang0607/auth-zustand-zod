import { useAuthStore } from "@/stores/useAuthStore";
import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.DEV ? 'http://localhost:5001' : '/api',
    withCredentials: true,
});

// Gắn access token vào header
api.interceptors.request.use((config) => {
    const { accessToken } = useAuthStore.getState();
    if(accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});