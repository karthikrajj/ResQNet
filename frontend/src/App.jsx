import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext, AuthProvider } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import CitizenDashboard from './pages/CitizenDashboard';
import VolunteerDashboard from './pages/VolunteerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Navbar from './components/Navbar';

axios.defaults.baseURL = 'http://localhost:5000';

const PrivateRoute = ({ children, roles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" />; // Redirect if not authorized
  }

  return children;
};

const AppContent = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route 
              path="/citizen/*" 
              element={
                <PrivateRoute roles={['Citizen', 'Admin']}>
                  <CitizenDashboard />
                </PrivateRoute>
              } 
            />
            
            <Route 
              path="/volunteer/*" 
              element={
                <PrivateRoute roles={['Volunteer', 'Admin']}>
                  <VolunteerDashboard />
                </PrivateRoute>
              } 
            />
            
            <Route 
              path="/admin/*" 
              element={
                <PrivateRoute roles={['Admin']}>
                  <AdminDashboard />
                </PrivateRoute>
              } 
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

const App = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;
