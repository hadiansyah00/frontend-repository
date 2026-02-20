import axios from "axios";

// Ambil BASE_URL dari environment (.env file)
const API_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

// Custom axios instance khusus API endpoint
const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor Request: Selalu sisipkan token jika ada sebelum kirim request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor Response: Tangani error global (misal token expired 401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Jika backend mengirim 401 (Unauthorized/Token kadaluarsa)
    if (error.response && error.response.status === 401) {
      // Hapus token lama
      localStorage.removeItem("auth_token");
      localStorage.removeItem("dummy_user"); // Bersihkan dummy/old data jika ada

      // Redirect ke login hanya jika tidak sedang di halaman public 
      // dan endpoint bukan login itu sendiri
      if (
        window.location.pathname !== "/login" &&
        window.location.pathname !== "/register" && 
        window.location.pathname !== "/"
      ) {
        window.location.href = "/login?expired=true";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
