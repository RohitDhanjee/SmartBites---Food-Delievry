// ============================================================
// Authentication Context (React Context API)
// ============================================================
// Provides global authentication state to all components.
// Manages user login, registration, logout, and cart state.
// Uses localStorage for persistence across page refreshes.
// ============================================================

import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [cartRestaurant, setCartRestaurant] = useState(null);

  // Load saved auth state on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('smartbite_token');
    const savedUser = localStorage.getItem('smartbite_user');
    const savedCart = localStorage.getItem('smartbite_cart');
    const savedCartRestaurant = localStorage.getItem('smartbite_cart_restaurant');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    if (savedCartRestaurant) {
      setCartRestaurant(JSON.parse(savedCartRestaurant));
    }
    setLoading(false);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('smartbite_cart', JSON.stringify(cart));
  }, [cart]);

  // ---- Login ----
  const login = async (email, password) => {
    const response = await api.post('/api/users/login', { email, password });
    const { user: userData, token: authToken } = response.data.data;
    
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('smartbite_token', authToken);
    localStorage.setItem('smartbite_user', JSON.stringify(userData));
    
    return response.data;
  };

  // ---- Register ----
  const register = async (name, email, password, phone, address) => {
    const response = await api.post('/api/users/register', {
      name, email, password, phone, address
    });
    const { user: userData, token: authToken } = response.data.data;
    
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('smartbite_token', authToken);
    localStorage.setItem('smartbite_user', JSON.stringify(userData));
    
    return response.data;
  };

  // ---- Logout ----
  const logout = () => {
    setUser(null);
    setToken(null);
    setCart([]);
    setCartRestaurant(null);
    localStorage.removeItem('smartbite_token');
    localStorage.removeItem('smartbite_user');
    localStorage.removeItem('smartbite_cart');
    localStorage.removeItem('smartbite_cart_restaurant');
  };

  // ---- Cart Functions ----
  const addToCart = (item, restaurant) => {
    // If adding from a different restaurant, clear the cart first
    if (cartRestaurant && cartRestaurant._id !== restaurant._id) {
      if (!window.confirm('Your cart has items from another restaurant. Clear cart and add this item?')) {
        return;
      }
      setCart([]);
    }
    
    setCartRestaurant(restaurant);
    localStorage.setItem('smartbite_cart_restaurant', JSON.stringify(restaurant));
    
    setCart(prev => {
      const existing = prev.find(i => i._id === item._id);
      if (existing) {
        return prev.map(i => 
          i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setCart(prev => {
      const updated = prev.filter(i => i._id !== itemId);
      if (updated.length === 0) {
        setCartRestaurant(null);
        localStorage.removeItem('smartbite_cart_restaurant');
      }
      return updated;
    });
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(prev => prev.map(i => 
      i._id === itemId ? { ...i, quantity } : i
    ));
  };

  const clearCart = () => {
    setCart([]);
    setCartRestaurant(null);
    localStorage.removeItem('smartbite_cart');
    localStorage.removeItem('smartbite_cart_restaurant');
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <AuthContext.Provider value={{
      user, token, loading,
      login, register, logout,
      cart, cartRestaurant, cartTotal, cartCount,
      addToCart, removeFromCart, updateQuantity, clearCart,
      isAuthenticated: !!token
    }}>
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
