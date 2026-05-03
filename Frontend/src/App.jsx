import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async"; // Add this import
import ScrollToTop from "./assets/components/ScrollToTop";
import { AuthProvider } from "./context/AuthContext";
import Header from "./assets/partials/Header";
import Home from "./assets/components/Home";
import About from "./assets/components/About";
import Quote from "./assets/components/Quote";
import Footer from "./assets/partials/Footer";
import Services from "./assets/components/Services";
import CategoryPage from "./assets/components/CategoryPage";
import ProductPage from "./assets/components/ProductPage";
import Contact from "./assets/components/Contact";
import AuthModal from "./assets/components/AuthModal";
import SavedProducts from "./assets/components/SavedProducts";
import Checkout from "./assets/components/Checkout";
import OrderConfirmation from "./assets/components/OrderConfirmation";
import MyOrders from "./assets/components/MyOrders";
import ProtectedRoute from "./assets/components/ProtectedRoute";
import VerifyEmail from "./assets/components/VerifyEmail";

// Policy Pages
import PrivacyPolicy from "./assets/components/PrivacyPolicy";
import TermsConditions from "./assets/components/TermsConditions";
import ShippingPolicy from "./assets/components/ShippingPolicy";
import ReturnPolicy from "./assets/components/ReturnPolicy";

// Admin imports
import AdminLogin from "./assets/admin/AdminLogin";
import AdminDashboard from "./assets/admin/AdminDashboard";
import AdminOrders from "./assets/admin/AdminOrders";
import AdminQuotes from "./assets/admin/AdminQuotes";
import AdminServices from "./assets/admin/AdminServices";
import AdminProducts from "./assets/admin/AdminProducts";
import AdminUsers from "./assets/admin/AdminUsers";

function Layout() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
      <AuthModal />
    </>
  );
}

function App() {
  return (
    <HelmetProvider> {/* Wrap everything with HelmetProvider */}
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/verify-email" element={<VerifyEmail />} />
            {/* Public Routes - No login required */}
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/:categorySlug" element={<CategoryPage />} />
              <Route path="/services/:categorySlug/:productSlug" element={<ProductPage />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/quote" element={<Quote />} />
              
              {/* Policy Pages */}
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-conditions" element={<TermsConditions />} />
              <Route path="/shipping-policy" element={<ShippingPolicy />} />
              <Route path="/return-policy" element={<ReturnPolicy />} />
              
              {/* Protected Customer Routes - Require Login */}
              <Route path="/saved-products" element={
                <ProtectedRoute>
                  <SavedProducts />
                </ProtectedRoute>
              } />
              <Route path="/order-confirmation/:orderId" element={
                <ProtectedRoute>
                  <OrderConfirmation />
                </ProtectedRoute>
              } />
              <Route path="/my-orders" element={
                <ProtectedRoute>
                  <MyOrders />
                </ProtectedRoute>
              } />
            </Route>
            
            {/* Admin Routes - Require Admin Login */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={
              <ProtectedRoute requireAdmin={true}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/orders" element={
              <ProtectedRoute requireAdmin={true}>
                <AdminOrders />
              </ProtectedRoute>
            } />
            <Route path="/admin/quotes" element={
              <ProtectedRoute requireAdmin={true}>
                <AdminQuotes />
              </ProtectedRoute>
            } />
            <Route path="/admin/services" element={
              <ProtectedRoute requireAdmin={true}>
                <AdminServices />
              </ProtectedRoute>
            } />
            <Route path="/admin/products" element={
              <ProtectedRoute requireAdmin={true}>
                <AdminProducts />
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute requireAdmin={true}>
                <AdminUsers />
              </ProtectedRoute>
            } />
            
            {/* 404 */}
            <Route path="*" element={<h1 className="text-center text-2xl py-20">404 - Page Not Found</h1>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;