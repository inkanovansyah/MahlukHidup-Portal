import { create } from 'zustand';
import type { User } from '../types/auth.types';
import { getCookie, setCookie, removeCookie, isTokenExpired } from '../utils/cookies';

const TOKEN_COOKIE_NAME = 'auth_token';
const USER_COOKIE_NAME = 'auth_user';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
  checkAuth: () => boolean;
  setError: (error: string | null) => void;
  clearError: () => void;
}

// Helper to persist user to cookie
const persistUser = (user: User | null) => {
  if (user) {
    setCookie(USER_COOKIE_NAME, JSON.stringify(user), { 
      sameSite: 'strict',
      secure: true,
    });
  } else {
    removeCookie(USER_COOKIE_NAME);
  }
};

// Helper to persist token to cookie
const persistToken = (token: string | null) => {
  if (token) {
    const expirationTime = getTokenExpirationDate(token);
    setCookie(TOKEN_COOKIE_NAME, token, { 
      expires: expirationTime || undefined,
      sameSite: 'strict',
      secure: true,
    });
  } else {
    removeCookie(TOKEN_COOKIE_NAME);
  }
};

// Get token expiration date for cookie
const getTokenExpirationDate = (token: string): Date | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = JSON.parse(atob(parts[1]));
    
    if (payload.exp) {
      return new Date(payload.exp * 1000);
    }
    
    return null;
  } catch {
    return null;
  }
};

// Initialize from cookies
const initializeAuth = () => {
  const token = getCookie(TOKEN_COOKIE_NAME);
  const userJson = getCookie(USER_COOKIE_NAME);
  
  if (token && userJson && !isTokenExpired(token)) {
    try {
      const user = JSON.parse(userJson) as User;
      return { user, token, isAuthenticated: true };
    } catch {
      // Invalid user data, clear everything
      removeCookie(TOKEN_COOKIE_NAME);
      removeCookie(USER_COOKIE_NAME);
    }
  } else if (token) {
    // Token exists but is expired or invalid
    removeCookie(TOKEN_COOKIE_NAME);
    removeCookie(USER_COOKIE_NAME);
  }
  
  return { user: null, token: null, isAuthenticated: false };
};

const initialAuth = initializeAuth();

export const useAuthStore = create<AuthState>((set) => ({
  user: initialAuth.user,
  token: initialAuth.token,
  isAuthenticated: initialAuth.isAuthenticated,
  isLoading: false,
  error: null,
  
  login: (token, userData) => {
    persistToken(token);
    persistUser(userData);
    set({ 
      user: userData, 
      token,
      isAuthenticated: true,
      error: null,
    });
  },
  
  logout: () => {
    persistToken(null);
    persistUser(null);
    set({ 
      user: null, 
      token: null,
      isAuthenticated: false,
      error: null,
    });
  },
  
  checkAuth: () => {
    const { token, user } = useAuthStore.getState();
    
    if (!token || !user || isTokenExpired(token)) {
      useAuthStore.getState().logout();
      return false;
    }
    
    return true;
  },
  
  setError: (error) => set({ error }),
  
  clearError: () => set({ error: null }),
}));
