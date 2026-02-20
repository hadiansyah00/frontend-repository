import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "./ProtectedRoute";

// Route wrapper yang menggabungkan ProtectedRoute + Permission Check
export default function RoleRoute({ children, permission, requireAll = false }) {
  const { hasPermission, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
         <div className="w-8 h-8 border-4 border-orange-500 rounded-full border-t-transparent animate-spin"></div>
      </div>
    );
  }

  // Jika belum login, biar ProtectedRoute yang urus (tapi RoleRoute juga bisa handle biar aman)
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const checkPermission = () => {
    if (!permission) return true; // Jika tidak butuh spesifik permission
    
    if (Array.isArray(permission)) {
      if (requireAll) {
        return permission.every((p) => hasPermission(p));
      }
      return permission.some((p) => hasPermission(p));
    }
    return hasPermission(permission);
  };

  if (!checkPermission()) {
    // Redirect ke dashboard home kalau gak punya akses halaman ini
    return <Navigate to="/dashboard" replace />;
  }

  // Bungkus ulang dengan ProtectedRoute just in case (atau langsung return children juga gpp karena udah dicek di atas)
  return children;
}
