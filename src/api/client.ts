import axios from 'axios';

export const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add auth token to requests
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Products API
type ProductFilters = {
  search?: string;
  category?: string;
  sort?: 'latest' | 'price_low' | 'price_high';
  brand?: string;
};

export const categoriesApi = {
  getAll: () => client.get('/categories'),
  getOne: (id: number) => client.get(`/categories/${id}`),
  create: (data: any) => client.post('/categories', data),
  update: (id: number, data: any) => client.put(`/categories/${id}`, data),
  delete: (id: number) => client.delete(`/categories/${id}`),
};

export const productsApi = {
  getAll: (page = 1, filters?: ProductFilters) => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    
    if (filters) {
      if (filters.search) params.append('search', filters.search);
      if (filters.category) params.append('category', filters.category);
      if (filters.sort) params.append('sort', filters.sort);
      if (filters.brand) params.append('brand', filters.brand);
    }

    return client.get(`/products?${params.toString()}`);
  },
  getOne: (id: number) => client.get(`/products/${id}`),
  create: (data: any) => client.post('/products', data),
  update: (id: number, data: any) => client.put(`/products/${id}`, data),
  delete: (id: number) => client.delete(`/products/${id}`),
};

// Repair Orders API
export const repairsApi = {
  getAll: () => client.get('/repairs'),
  getOne: (id) => client.get(`/repairs/${id}`),
  create: (data) => client.post('/repairs', data),
  updateStatus: (id, status) => client.patch(`/repairs/${id}/status`, { status }),
  getServices: () => client.get('/repairs/services'),
  track: (code) => client.get(`/repairs/track/${code}`),
};

// Trade API
export const tradesApi = {
  getAll: () => client.get('/trades'),
  create: (data) => client.post('/trades', data),
  updateStatus: (id, status) => client.patch(`/trades/${id}/status`, { status }),
  cancel: (id) => client.post(`/trades/${id}/cancel`),
};

// Auth API
export const authApi = {
  login: (credentials) => client.post('/auth/login', credentials),
  register: (data) => client.post('/auth/register', data),
  logout: () => client.post('/auth/logout'),
  getUser: () => client.get('/auth/user'),
};

export default client;