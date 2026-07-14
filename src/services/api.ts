import axios from 'axios';
import { useNetworkStore } from '../stores/networkStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use((config) => {
  console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    // If a request succeeds, ensure network is marked as up
    if (useNetworkStore.getState().isDown) {
      useNetworkStore.getState().setDown(false);
    }
    return response;
  },
  (error) => {
    console.error('[API Error]', error.response?.data || error.message);
    if (!error.response || error.code === 'ERR_NETWORK') {
      useNetworkStore.getState().setDown(true);
    }
    return Promise.reject(error);
  }
);

export const apiService = {
  qr: {
    generate: (locationName: string) => api.get(`/qr/generate?locationName=${encodeURIComponent(locationName)}`).then(res => res.data),
    validate: (token: string) => api.get(`/qr/validate?token=${token}`).then(res => res.data),
  },
  orders: {
    create: (payload: any) => api.post('/orders', payload).then(res => res.data),
  },
  admin: {
    getDashboard: () => api.get('/admin/dashboard').then(res => res.data),
  },
  products: {
    getAll: () => api.get('/products').then(res => res.data),
    create: (payload: any) => api.post('/products', payload).then(res => res.data),
    updateStatus: (id: string, isActive: boolean) => api.put(`/products/${id}/status`, { isActive }).then(res => res.data),
  },
  locations: {
    getAll: () => api.get('/locations').then(res => res.data),
    create: (payload: any) => api.post('/locations', payload).then(res => res.data),
    updateStatus: (id: string, isActive: boolean) => api.put(`/locations/${id}/status`, { isActive }).then(res => res.data),
  }
};

export default api;
