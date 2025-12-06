// API Configuration
export const API_URL = 'http://127.0.0.1:8000/api';

// Get token from localStorage
export const getToken = () => {
  return localStorage.getItem('token');
};

// Set token to localStorage
export const setToken = (token) => {
  localStorage.setItem('token', token);
};

// Remove token from localStorage
export const removeToken = () => {
  localStorage.removeItem('token');
};

// Get user from localStorage
export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Set user to localStorage
export const setUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

// Remove user from localStorage
export const removeUser = () => {
  localStorage.removeItem('user');
};
