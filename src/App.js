import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';
import CreateEditPost from './pages/CreateEditPost';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import Contact from './pages/Contact';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="spinner" style={{ marginTop: 80 }} />;
  return user ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="spinner" style={{ marginTop: 80 }} />;
  if (!user) return <Navigate to="/login" replace />;
  if (!user.is_admin) return <Navigate to="/" replace />;
  return children;
};

const NoAuthRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? <Navigate to="/dashboard" replace /> : children;
};

function AppRoutes() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: 14 }}>
        <div style={{ width: 40, height: 40, border: '3px solid #E2E2DA', borderTopColor: '#E84A27', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
        <p style={{ color: '#94A3B8', fontFamily: 'Inter, sans-serif', fontSize: 13 }}>Loading…</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <Routes>
      {/* Auth pages (no navbar) */}
      <Route path="/login" element={<NoAuthRoute><Login /></NoAuthRoute>} />
      <Route path="/register" element={<NoAuthRoute><Register /></NoAuthRoute>} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      {/* All other pages (with navbar) */}
      <Route path="*" element={
        <>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/post/:id" element={<PostDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/create" element={<PrivateRoute><CreateEditPost /></PrivateRoute>} />
            <Route path="/edit/:id" element={<PrivateRoute><CreateEditPost /></PrivateRoute>} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
            <Route path="*" element={
              <div style={{ textAlign: 'center', padding: '80px 20px' }}>
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 96, color: '#E2E2DA', lineHeight: 1, marginBottom: 16 }}>404</div>
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 800, fontSize: 28, marginBottom: 10 }}>Page not found</h2>
                <p style={{ color: '#64748B', marginBottom: 24, fontSize: 15 }}>The page you're looking for doesn't exist.</p>
                <a href="/" className="btn btn-primary">Go home</a>
              </div>
            } />
          </Routes>
        </>
      } />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            style: { fontFamily: 'Inter, sans-serif', fontSize: 14, borderRadius: 8, border: '1.5px solid #E2E2DA', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' },
            success: { iconTheme: { primary: '#059669', secondary: 'white' } },
            error: { iconTheme: { primary: '#DC2626', secondary: 'white' } },
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  );
}
