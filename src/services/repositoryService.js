import api from "./api";

const repositoryService = {
  // Ambil semua repository (paginated, dengan filter opsional)
  getRepositories: async (params = {}) => {
    const response = await api.get("/repositories", { params });
    return response.data;
  },

  getPublicRepositories: async (params = {}) => {
    const response = await api.get("/public/repositories", { params });
    return response.data;
  },

  // Ambil detail 1 repository dengan id
  getRepositoryById: async (id) => {
    const response = await api.get(`/repositories/${id}`);
    return response.data;
  },

  // Buat repository baru (menggunakan form-data karena ada upload file)
  createRepository: async (formData) => {
    const response = await api.post("/repositories", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Update repository metadata (tanpa file)
  updateRepository: async (id, data) => {
    const response = await api.put(`/repositories/${id}`, data);
    return response.data;
  },

  // Soft delete / Archived repository
  deleteRepository: async (id) => {
    const response = await api.delete(`/repositories/${id}`);
    return response.data;
  },

  // Download URL constructor
  getDownloadUrl: (id) => {
    return `${api.defaults.baseURL}/repositories/${id}/download`;
  }
};

export default repositoryService;
