import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import { ToastProvider } from './contexts/ToastContext.jsx';
import { CartProvider } from './contexts/CartContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AdminRoute from './components/AdminRoute.jsx';
import SupplierRoute from './components/SupplierRoute.jsx';
import Navbar from './components/Navbar.jsx';

// Pages
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import UsuariosPage from './pages/UsuariosPage.jsx';
import UsuarioFormPage from './pages/UsuarioFormPage.jsx';
import PerfilPage from './pages/PerfilPage.jsx';
import HomePage from './pages/HomePage.jsx';
import ProductsPage from './pages/ProductsPage.jsx';
import CartPage from './pages/CartPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';

function AdminLayout({ children }) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>{children}</main>
    </div>
  );
}

function HomeRedirect() {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return <Navigate to={isAuthenticated ? '/usuarios' : '/'} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <Routes>
              {/* Public Marketplace Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/produtos" element={<ProductsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/registro" element={<RegisterPage />} />

              {/* Protected Cart & Checkout Routes */}
              <Route
                path="/carrinho"
                element={
                  <ProtectedRoute>
                    <CartPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <CheckoutPage />
                  </ProtectedRoute>
                }
              />

              {/* Protected Admin Routes */}
              <Route path="/admin" element={<HomeRedirect />} />
              <Route
                path="/usuarios"
                element={
                  <AdminRoute>
                    <AdminLayout>
                      <UsuariosPage />
                    </AdminLayout>
                  </AdminRoute>
                }
              />
              <Route
                path="/usuarios/novo"
                element={
                  <AdminRoute>
                    <AdminLayout>
                      <UsuarioFormPage />
                    </AdminLayout>
                  </AdminRoute>
                }
              />
              <Route
                path="/usuarios/:id/editar"
                element={
                  <AdminRoute>
                    <AdminLayout>
                      <UsuarioFormPage />
                    </AdminLayout>
                  </AdminRoute>
                }
              />
              <Route
                path="/perfil"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <PerfilPage />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />

              {/* Profile & Personal */}
              <Route
                path="/perfil"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <PerfilPage />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
