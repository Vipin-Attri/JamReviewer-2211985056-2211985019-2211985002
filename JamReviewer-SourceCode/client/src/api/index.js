import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Attach token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');

// Songs
export const getSongs = (params) => API.get('/songs', { params });
export const getSong = (id) => API.get(`/songs/${id}`);
export const uploadSong = (formData) =>
  API.post('/songs', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteSong = (id) => API.delete(`/songs/${id}`);
export const playSong = (id) => API.post(`/songs/${id}/play`);
export const getCreatorAnalytics = () => API.get('/songs/analytics');

// Comments
export const getComments = (songId) => API.get(`/comments/${songId}`);
export const addComment = (songId, data) => API.post(`/comments/${songId}`, data);
export const deleteComment = (id) => API.delete(`/comments/${id}`);

// Ratings
export const rateSong = (songId, data) => API.post(`/ratings/${songId}`, data);
export const getUserRating = (songId) => API.get(`/ratings/${songId}`);

// Admin
export const getAdminStats = () => API.get('/admin/stats');
export const getAdminUsers = () => API.get('/admin/users');
export const toggleBlock = (id) => API.patch(`/admin/users/${id}/block`);
export const getAdminSongs = () => API.get('/admin/songs');
export const adminDeleteSong = (id) => API.delete(`/admin/songs/${id}`);

export default API;
