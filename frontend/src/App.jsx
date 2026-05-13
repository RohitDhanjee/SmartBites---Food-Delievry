// ============================================================
// App Component — Main Application Router
// ============================================================

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import RestaurantMenu from './pages/RestaurantMenu';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import TrackOrder from './pages/TrackOrder';
import AdminDashboard from './pages/AdminDashboard';
import AddEditRestaurant from './pages/AddEditRestaurant';
import ManageMenu from './pages/ManageMenu';
import ReviewPage from './pages/ReviewPage';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import { useEffect } from 'react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4005';

function App() {
  useEffect(() => {
    const socket = io(SOCKET_URL);
    
    socket.on('delivery_update', (data) => {
      // Show notification if it's a significant update
      if (data.message) {
        toast.success(`Order Update: ${data.message}`, {
          duration: 5000,
          position: 'bottom-right',
          icon: '🚴'
        });
      }
    });

    return () => socket.disconnect();
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/restaurant/:id" element={<RestaurantMenu />} />
              
              {/* Protected Routes — require authentication */}
              <Route path="/cart" element={
                <ProtectedRoute><Cart /></ProtectedRoute>
              } />
              <Route path="/orders" element={
                <ProtectedRoute><Orders /></ProtectedRoute>
              } />
              <Route path="/track/:orderId" element={
                <ProtectedRoute><TrackOrder /></ProtectedRoute>
              } />
              <Route path="/review/:orderId" element={
                <ProtectedRoute><ReviewPage /></ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute><Profile /></ProtectedRoute>
              } />

              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>
              } />
              <Route path="/admin/restaurant/add" element={
                <ProtectedRoute adminOnly={true}><AddEditRestaurant /></ProtectedRoute>
              } />
              <Route path="/admin/restaurant/edit/:id" element={
                <ProtectedRoute adminOnly={true}><AddEditRestaurant /></ProtectedRoute>
              } />
              <Route path="/admin/menu/:restaurantId" element={
                <ProtectedRoute adminOnly={true}><ManageMenu /></ProtectedRoute>
              } />
              <Route path="/admin/analytics" element={
                <ProtectedRoute adminOnly={true}><Analytics /></ProtectedRoute>
              } />
            </Routes>
          </main>
          
          {/* Toast notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#1e1e2e',
                color: '#f1f5f9',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
              },
              success: {
                iconTheme: { primary: '#22c55e', secondary: '#fff' }
              },
              error: {
                iconTheme: { primary: '#ef4444', secondary: '#fff' }
              }
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
