import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
const API = import.meta.env.VITE_API_URL || 'http://localhost:4001';

const AuthContext = createContext();
const API_URL = `${API}/api`;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [savedProducts, setSavedProducts] = useState([]);
  const [token, setToken] = useState(null);
  
  // Orders state
  const [orders, setOrders] = useState([]);

  // Initialize auth from localStorage and fetch saved products from backend
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      
      // Fetch saved products from MongoDB
      fetchSavedProductsFromBackend(storedToken);
      // Fetch user orders
      fetchUserOrders(storedToken);
    }
    
    setLoading(false);
  }, []);

  // Fetch saved products from MongoDB
  const fetchSavedProductsFromBackend = async (authToken) => {
    try {
      const response = await axios.get(`${API_URL}/auth/saved-products`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setSavedProducts(response.data.savedProducts || []);
    } catch (error) {
      console.error('Error fetching saved products from MongoDB:', error);
      const storedSaved = localStorage.getItem('savedProducts');
      if (storedSaved) {
        setSavedProducts(JSON.parse(storedSaved));
      }
    }
  };

  // Fetch user orders from backend
  const fetchUserOrders = async (authToken) => {
    try {
      const response = await axios.get(`${API_URL}/orders/my-orders`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  // Save token and user to localStorage when they change
  useEffect(() => {
    if (user && token) {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [user, token]);

  // Backup saved products to localStorage
  useEffect(() => {
    if (savedProducts.length >= 0) {
      localStorage.setItem('savedProducts', JSON.stringify(savedProducts));
    }
  }, [savedProducts]);

  const login = async (email, phone) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { 
        email: email || undefined,
        phone: phone || undefined
      });
      
      if (response.data.success) {
        setUser(response.data.user);
        setToken(response.data.token);
        setSavedProducts(response.data.user.savedProducts || []);
        setShowAuthModal(false);
        
        // Fetch orders after login
        await fetchUserOrders(response.data.token);
        
        return { success: true };
      }
      return { success: false, error: response.data.error };
    } catch (error) {
      console.error('Login error:', error);
      const errorMsg = error.response?.data?.error || 'Login failed. Please try again.';
      alert(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const signup = async (name, email, phone) => {
    try {
      const response = await axios.post(`${API_URL}/auth/signup`, { name, email, phone });
      
      if (response.data.success) {
        // If verification is required, don't close modal, just return the info
        if (response.data.requiresVerification) {
          return { 
            success: true, 
            requiresVerification: true,
            message: response.data.message,
            email: email
          };
        }
        
        // Only close modal and set user if no verification needed
        setUser(response.data.user);
        setToken(response.data.token);
        setSavedProducts(response.data.user.savedProducts || []);
        setShowAuthModal(false);
        return { success: true };
      }
      return { success: false, error: response.data.error };
    } catch (error) {
      console.error('Signup error:', error);
      const errorMsg = error.response?.data?.error || 'Signup failed. Please try again.';
      alert(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setSavedProducts([]);
    setOrders([]);
  };

  const toggleSaveProduct = async (productId) => {
    if (!user) {
      setShowAuthModal(true);
      return false;
    }
    
    const isSaved = savedProducts.includes(productId);
    
    try {
      if (isSaved) {
        await axios.delete(`${API_URL}/auth/remove-saved-product/${productId}`);
        setSavedProducts(prev => prev.filter(id => id !== productId));
        console.log('Product removed from MongoDB saved list');
      } else {
        await axios.post(`${API_URL}/auth/save-product`, { productId });
        setSavedProducts(prev => [...prev, productId]);
        console.log('Product added to MongoDB saved list');
      }
      return true;
    } catch (error) {
      console.error('Error saving product to MongoDB:', error);
      if (isSaved) {
        setSavedProducts(prev => prev.filter(id => id !== productId));
      } else {
        setSavedProducts(prev => [...prev, productId]);
      }
      alert('Could not sync with server. Changes saved locally only.');
      return false;
    }
  };

  const isProductSaved = (productId) => {
    return savedProducts.includes(productId);
  };

  const openAuthModal = (mode = 'login') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const closeAuthModal = () => {
    setShowAuthModal(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      signup,
      logout,
      savedProducts,
      toggleSaveProduct,
      isProductSaved,
      showAuthModal,
      authMode,
      openAuthModal,
      closeAuthModal,
      setAuthMode,
      // Orders exports
      orders,
      setOrders,
      fetchUserOrders
    }}>
      {children}
    </AuthContext.Provider>
  );
};