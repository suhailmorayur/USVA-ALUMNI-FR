import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layouts
import Layout from './layouts/Layout';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Membership from './pages/Membership';
import Payment from './pages/Payment';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailed from './pages/PaymentFailed';
import Status from './pages/Status';
import Verify from './pages/Verify';
import Download from './pages/Download';

// Admin Pages
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminMembers from './pages/AdminMembers';
import AdminMemberDetails from './pages/AdminMemberDetails';
import AdminPayments from './pages/AdminPayments';
import AdminCards from './pages/AdminCards';
import AdminSettings from './pages/AdminSettings';
import AdminReports from './pages/AdminReports';
import AdminPrint from './pages/AdminPrint';

// Admin Protected Route Guard
const AdminRoute = ({ children }) => {
  const { admin, adminToken, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-700"></div>
      </div>
    );
  }

  if (!adminToken || !admin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Website Routes (Header/Footer Layout) */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="membership" element={<Membership />} />
            <Route path="payment" element={<Payment />} />
            <Route path="payment/success" element={<PaymentSuccess />} />
            <Route path="payment/failed" element={<PaymentFailed />} />
            <Route path="status" element={<Status />} />
            <Route path="download" element={<Download />} />
          </Route>

          {/* Standalone Public Verification Route (No default header/footer) */}
          <Route path="/verify/:membershipId" element={<Verify />} />

          {/* Standalone Admin Login Route */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected Admin Console Routes (Standalone Nav) */}
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/members" 
            element={
              <AdminRoute>
                <AdminMembers />
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/members/:id" 
            element={
              <AdminRoute>
                <AdminMemberDetails />
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/payments" 
            element={
              <AdminRoute>
                <AdminPayments />
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/cards" 
            element={
              <AdminRoute>
                <AdminCards />
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/settings" 
            element={
              <AdminRoute>
                <AdminSettings />
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/reports" 
            element={
              <AdminRoute>
                <AdminReports />
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/print" 
            element={
              <AdminRoute>
                <AdminPrint />
              </AdminRoute>
            } 
          />

          {/* Fallback Catch-All Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
