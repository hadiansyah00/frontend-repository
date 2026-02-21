import api from "./api";

const masterDataService = {
  // === PROGRAM STUDI ===
  getProdis: async () => {
    const response = await api.get("/prodi");
    return response.data;
  },

  getPublicProdis: async () => {
    const response = await api.get("/public/prodi");
    return response.data;
  },

  createProdi: async (data) => {
    const response = await api.post("/prodi", data);
    return response.data;
  },

  updateProdi: async (id, data) => {
    const response = await api.put(`/prodi/${id}`, data);
    return response.data;
  },

  deleteProdi: async (id) => {
    const response = await api.delete(`/prodi/${id}`);
    return response.data;
  },

  // === JENIS DOKUMEN (Doc Types) ===
  getDocTypes: async () => {
    const response = await api.get("/doc-types");
    return response.data;
  },

  getPublicDocTypes: async () => {
    const response = await api.get("/public/doc-types");
    return response.data;
  },

  createDocType: async (data) => {
    const response = await api.post("/doc-types", data);
    return response.data;
  },

  updateDocType: async (id, data) => {
    const response = await api.put(`/doc-types/${id}`, data);
    return response.data;
  },

  deleteDocType: async (id) => {
    const response = await api.delete(`/doc-types/${id}`);
    return response.data;
  },
};

export default masterDataService;
