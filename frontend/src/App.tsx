import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Public Pages
import StorePage from './pages/StorePage';
import ProductPage from './pages/ProductPage';
import ThankYouPage from './pages/ThankYouPage';

// Admin Pages
import AdminLogin from './pages/admin/LoginPage';
import Dashboard from './pages/admin/DashboardPage';
import ProductsList from './pages/admin/ProductsPage';
import OrdersList from './pages/admin/OrdersPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<StorePage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/thank-you/:orderId" element={<ThankYouPage />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <ProtectedRoute>
                <ProductsList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute>
                <OrdersList />
              </ProtectedRoute>
            }
          />
        </Routes>
        <ToastContainer />
      </div>
    </Router>
  );
}

export default App;
