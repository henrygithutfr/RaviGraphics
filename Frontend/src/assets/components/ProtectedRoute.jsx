import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, loading } = useAuth();
  
  // Check for admin token in localStorage
  const adminToken = localStorage.getItem("adminToken");
  const adminData = localStorage.getItem("admin");
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }
  
  // For admin routes
  if (requireAdmin) {
    if (!adminToken || !adminData) {
      return <Navigate to="/admin" replace />;
    }
    return children;
  }
  
  // For regular protected routes (like checkout, my-orders)
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  return children;
}