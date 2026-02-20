import api from "./api";

const roleService = {
  getRoles: async () => {
    const response = await api.get("/roles");
    return response.data;
  },

  getPermissions: async () => {
    const response = await api.get("/roles/permissions");
    return response.data;
  },

  updateRolePermissions: async (id, permissions) => {
    const response = await api.put(`/roles/${id}/permissions`, { permissions });
    return response.data;
  },
};

export default roleService;
