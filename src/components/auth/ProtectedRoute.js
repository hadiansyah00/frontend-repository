import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-orange-500 rounded-full border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect ke login, tapi simpan lokasi awal yg ingin dituju
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Jika butuh validasi role spesifik
  if (role && user?.role !== role) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
