import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute element={<Dashboard />} />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

const PrivateRoute = ({ element }) => {
  const { user } = React.useContext(AuthContext);
  return user ? element : <Navigate to="/login" />;
};

export default App;
