import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() => localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null);
  const [user, setUser] = useState(() => authTokens ? jwt_decode(authTokens.access) : null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (authTokens) {
      setUser(jwt_decode(authTokens.access));
      setLoading(false);
      const interval = setInterval(updateToken, 1000 * 60 * 4); // Each 4 minutes
      return () => clearInterval(interval);
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: e.target.username.value, password: e.target.password.value })
      });
      const data = await response.json();

      if (response.status === 200) {
        setAuthTokens(data);
        setUser(jwt_decode(data.access));
        localStorage.setItem('authTokens', JSON.stringify(data));
        navigate('/');
      } else {
        setError("Invalid username or password.");
      }
    } catch (err) {
      setError("An error occurred during login.");
    }
  };

  const logout = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem('authTokens');
    navigate('/login');
  };

  const updateToken = async () => {
    if (authTokens) {
      try {
        const response = await fetch('/api/token/refresh/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ refresh: authTokens.refresh })
        });
        const data = await response.json();

        if (response.status === 200) {
          setAuthTokens(data);
          setUser(jwt_decode(data.access));
          localStorage.setItem('authTokens', JSON.stringify(data));
        } else {
          logout();
        }
      } catch (err) {
        logout();
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};
