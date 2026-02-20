import api from "./api";

const authService = {
  // Login dan simpan token
  login: async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    if (response.data.token) {
      localStorage.setItem("auth_token", response.data.token);
    }
    return response.data;
  },

  // Register user baru
  register: async (data) => {
    const response = await api.post("/auth/register", data);
    if (response.data.token) {
       localStorage.setItem("auth_token", response.data.token);
    }
    return response.data;
  },

  // Ambil profil current user
  getMe: async () => {
    const response = await api.get("/auth/me");
    return response.data.user;
  },

  // Logout (hanya hapus token lokal karena backend pakai stateless JWT)
  logout: () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("dummy_user");
  }
};

export default authService;
