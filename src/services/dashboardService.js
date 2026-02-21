import api from "./api";

const dashboardService = {
  getStats: async () => {
    const response = await api.get("/dashboard/stats");
    return response.data;
  },
  getPublicStats: async () => {
    const response = await api.get("/public/stats");
    return response.data;
  },
};

export default dashboardService;
