import { create } from 'zustand';
import { getToken, getUser, setToken, setUser, removeToken, removeUser } from '../config/config';
import { authAPI } from '../services/api';

export const useAuthStore = create((set) => ({
  user: getUser(),
  token: getToken(),
  isAuthenticated: !!getToken(),
  loading: false,
  error: null,

  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      console.log('Login attempt with:', credentials); // Debug log
      const response = await authAPI.login(credentials);
      console.log('Login response:', response.data); // Debug log
      const { user, token } = response.data;
      
      setToken(token);
      setUser(user);
      
      set({
        user,
        token,
        isAuthenticated: true,
        loading: false,
      });
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error); // Debug log
      console.error('Error response:', error.response); // Debug log
      
      let errorMessage = 'Login failed';
      
      if (error.response?.data?.errors) {
        // Handle validation errors
        const errors = error.response.data.errors;
        errorMessage = Object.values(errors).flat().join(', ');
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      set({ error: errorMessage, loading: false });
      return { success: false, error: errorMessage };
    }
  },

  logout: async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      removeToken();
      removeUser();
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        error: null,
      });
    }
  },

  clearError: () => set({ error: null }),
}));
