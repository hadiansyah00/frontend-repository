import { useAuth } from "@/contexts/AuthContext";

/**
 * Komponen wrapper yang hanya me-render children-nya jika user memiliki permission tertentu.
 * 
 * @param {string | string[]} permission - String tunggal atau array string permission yang dibutuhkan. 
 *                                        Jika array, akan dicek apakah user memiliki *salah satu* (OR).
 * @param {boolean} requireAll - Jika true dan permission adalah array, user harus memiliki *semua* permission (AND).
 */
export default function PermissionGate({ children, permission, requireAll = false, fallback = null }) {
  const { hasPermission, loading, isAuthenticated } = useAuth();

  if (loading || !isAuthenticated) {
    return fallback;
  }

  const checkPermission = () => {
    if (Array.isArray(permission)) {
      if (requireAll) {
        return permission.every((p) => hasPermission(p));
      }
      return permission.some((p) => hasPermission(p));
    }
    return hasPermission(permission);
  };

  if (!checkPermission()) {
    return fallback;
  }

  return children;
}
