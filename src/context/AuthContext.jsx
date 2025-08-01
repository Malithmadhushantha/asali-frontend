import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

// Use environment variable for API URL, fallback for development
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

console.log('API URL configured as:', API_URL);

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
      return { 
        ...state, 
        loading: false, 
        user: action.payload.user, 
        token: action.payload.token,
        isAuthenticated: true,
        error: null 
      };
    case 'LOGIN_FAILURE':
      return { 
        ...state, 
        loading: false, 
        user: null, 
        token: null,
        isAuthenticated: false,
        error: action.payload 
      };
    case 'LOGOUT':
      return { 
        ...state, 
        user: null, 
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null 
      };
    case 'UPDATE_USER':
      return { ...state, user: action.payload };
    default:
      return state;
  }
};

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: false,
  error: null
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Configure axios defaults
  useEffect(() => {
    if (state.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
      // Verify token on app start
      verifyToken();
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [state.token]);

  const verifyToken = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/me`);
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: response.data.user,
          token: state.token
        }
      });
    } catch (error) {
      logout();
    }
  };

  const login = async (email, password) => {
    try {
      dispatch({ type: 'LOGIN_START' });
      
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });

      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, token }
      });

      // Role-based welcome message
      if (user.role === 'admin') {
        toast.success(`Welcome back, Admin ${user.name}! You have full system access.`);
      } else {
        toast.success(`Welcome back, ${user.name}! Happy shopping at Asali House of Fashion.`);
      }
      
      return { success: true, user };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: message
      });
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const register = async (name, email, password) => {
    try {
      dispatch({ type: 'LOGIN_START' });
      
      const response = await axios.post(`${API_URL}/auth/register`, {
        name,
        email,
        password,
        role: 'customer' // Always register as customer
      });

      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, token }
      });

      toast.success('Registration successful! Welcome to Asali House of Fashion.');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: message
      });
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const googleLogin = async (credentialResponse) => {
    try {
      dispatch({ type: 'LOGIN_START' });
      
      if (!credentialResponse?.credential) {
        throw new Error('No credential received from Google');
      }
      
      // Decode the JWT token from Google
      const decodedToken = JSON.parse(atob(credentialResponse.credential.split('.')[1]));
      
      // Validate required fields
      if (!decodedToken.email || !decodedToken.name) {
        throw new Error('Incomplete profile information from Google');
      }
      
      const response = await axios.post(`${API_URL}/auth/google-login`, {
        email: decodedToken.email,
        name: decodedToken.name,
        googleId: decodedToken.sub,
        picture: decodedToken.picture || null
      });

      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, token }
      });

      // Role-based welcome message for Google login
      if (user.role === 'admin') {
        toast.success(`Welcome ${user.name}! Google admin login successful.`);
      } else {
        toast.success(`Welcome ${user.name}! Google login successful.`);
      }
      
      return { success: true, user };
    } catch (error) {
      console.error('Google login error:', error);
      const message = error.response?.data?.message || error.message || 'Google login failed';
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: message
      });
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    dispatch({ type: 'LOGOUT' });
    toast.success('Logged out successfully');
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await axios.put(`${API_URL}/auth/profile`, profileData);
      
      dispatch({
        type: 'UPDATE_USER',
        payload: response.data.user
      });

      toast.success('Profile updated successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const value = {
    ...state,
    login,
    register,
    googleLogin,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};