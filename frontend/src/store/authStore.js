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
      const response = await authAPI.login(credentials);
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
      const errorMessage = error.response?.data?.message || 'Login failed';
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
