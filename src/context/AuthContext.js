import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() => localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null);
  const [user, setUser] = useState(() => authTokens ? jwt_decode(authTokens.access) : null);
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
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
      alert('Something went wrong!');
    }
  };

  const logout = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem('authTokens');
    navigate('/login');
  };

  const updateToken = async () => {
    const response = await fetch('/api/token/refresh/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ refresh: authTokens?.refresh })
    });
    const data = await response.json();

    if (response.status === 200) {
      setAuthTokens(data);
      setUser(jwt_decode(data.access));
      localStorage.setItem('authTokens', JSON.stringify(data));
    } else {
      logout();
    }
  };

  useEffect(() => {
    if (authTokens) {
      const interval = setInterval(() => {
        updateToken();
      }, 1000 * 60 * 4); // Every 4 minutes
      return () => clearInterval(interval);
    }
  }, [authTokens]);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
