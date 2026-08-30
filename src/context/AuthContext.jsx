import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken') || '');

  // Set default axios base URL
  useEffect(() => {
    axios.defaults.baseURL = import.meta.env.VITE_API_URL || '';
  }, []);

  // Update Axios default auth header when admin token changes
  useEffect(() => {
    if (adminToken) {
      localStorage.setItem('adminToken', adminToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${adminToken}`;
    } else {
      localStorage.removeItem('adminToken');
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [adminToken]);

  // Check admin auth status on load
  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      
      if (adminToken) {
        try {
          axios.defaults.headers.common['Authorization'] = `Bearer ${adminToken}`;
          // Get settings or test token validity
          const res = await axios.get('/api/admin/dashboard');
          if (res.data.success) {
            const cachedAdmin = localStorage.getItem('adminUser');
            if (cachedAdmin) {
              setAdmin(JSON.parse(cachedAdmin));
            } else {
              setAdmin({ email: 'admin@usva.org', role: 'admin' });
            }
          }
        } catch (err) {
          console.error('Admin token validation failed:', err);
          logoutAdmin();
        }
      } 

      setLoading(false);
    };

    initAuth();
  }, [adminToken]);

  // Admin Actions
  const loginAdmin = async (email, password) => {
    setLoading(true);
    try {
      const res = await axios.post('/api/admin/login', { email, password });
      if (res.data.success) {
        const adminData = res.data.data.admin;
        setAdminToken(res.data.data.token);
        setAdmin(adminData);
        localStorage.setItem('adminUser', JSON.stringify(adminData));
        return { success: true };
      }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Admin authentication failed'
      };
    } finally {
      setLoading(false);
    }
  };

  const logoutAdmin = () => {
    setAdminToken('');
    setAdmin(null);
    localStorage.removeItem('adminUser');
  };

  const value = {
    admin,
    loading,
    adminToken,
    loginAdmin,
    logoutAdmin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
