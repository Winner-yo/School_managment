import axios from 'axios';
const envBase = process.env.NEXT_PUBLIC_API_URL;
const baseURL = envBase ? envBase : 'http://localhost:5000/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const login = (credentials) => api.post('/auth/login', credentials);
export const register = (userData) => api.post('/auth/register', userData);
export const getStudents = () => api.get('/students');
export const updateGrade = (data) => api.post('/students/grade', data);
export const getOwnProfile = () => api.get('/students/profile');
export const getUsersByRole = (role) => api.get(`/users?role=${role}`);
export const getMe = () => api.get('/users/me');
export const updateProfile = (updateData) => api.put('/users/profile', updateData);
export const updateTeacherSubject = (id, subject) => api.put(`/users/${id}/subject`, { subject });
export const deleteUser = (id) => api.delete(`/users/${id}`);
export const updateUser = (id, userData) => api.put(`/users/${id}`, userData);

export default api;