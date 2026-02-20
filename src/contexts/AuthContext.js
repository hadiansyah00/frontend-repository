import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import authService from "@/services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Initial check on load
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("auth_token");
      if (token) {
        try {
          const userData = await authService.getMe();
          setUser(userData);
          setPermissions(userData.permissions || []);
        } catch (error) {
          console.error("Failed to restore session:", error);
          authService.logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      // 1. Hit API login
      const data = await authService.login(email, password);
      // 2. Fetch user profile + permissions
      const userData = await authService.getMe();
      
      setUser(userData);
      setPermissions(userData.permissions || []);
      
      toast.success(`Login berhasil sebagai ${userData.role?.name || "Pengguna"}`);
      return userData;
    } catch (error) {
      const msg = error.response?.data?.message || "Login gagal. Periksa kembali email dan password.";
      toast.error(msg);
      throw error;
    }
  };

  const register = async (name, email, password) => {
    try {
      // 1. Hit API register
      await authService.register({ name, email, password });
      // 2. Jika sukses auto-login, fetch data user
      const userData = await authService.getMe();
      
      setUser(userData);
      setPermissions(userData.permissions || []);
      
      toast.success("Registrasi berhasil!");
      return userData;
    } catch (error) {
      const errors = error.response?.data?.errors;
      const msg = errors ? errors[0].msg : error.response?.data?.message || "Registrasi gagal.";
      toast.error(msg);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setPermissions([]);
    toast.success("Berhasil logout");
    navigate("/login");
  };

  // Helper function to check permission
  const hasPermission = (requiredPermission) => {
    return permissions.includes(requiredPermission);
  };

  const value = {
    user,
    permissions,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
