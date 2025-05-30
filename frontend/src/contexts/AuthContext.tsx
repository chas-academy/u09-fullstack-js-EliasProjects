import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../config/api';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface DecodedToken {
  id: string;
  exp: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom JWT decode function
const decodeToken = (token: string): DecodedToken | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkTokenExpiration = (token: string) => {
    try {
      const decoded = decodeToken(token);
      if (!decoded) return false;
      
      const currentTime = Date.now() / 1000;
      
      if (decoded.exp < currentTime) {
        console.log('Token expired, logging out...');
        logout();
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return false;
    }
  };

  useEffect(() => {
    // Check for stored token and user data on mount
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      if (checkTokenExpiration(storedToken)) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      } else {
        logout();
      }
    }
  }, []);

  // Set up an interval to check token expiration
  useEffect(() => {
    if (token) {
      const interval = setInterval(() => {
        if (!checkTokenExpiration(token)) {
          logout();
        }
      }, 60000); // Check every minute

      return () => clearInterval(interval);
    }
  }, [token]);

  const login = (newToken: string, userData: User) => {
    if (checkTokenExpiration(newToken)) {
      setToken(newToken);
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
    } else {
      logout();
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Use window.location for navigation instead of useNavigate
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 