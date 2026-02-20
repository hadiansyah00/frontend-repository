import api from './api';

const approvalService = {
  // Get all pending repositories
  getPendingRepos: async (params = {}) => {
    // API endpoint allows status filtering
    const response = await api.get('/repositories', {
      params: { ...params, status: 'pending' }
    });
    return response.data;
  },

  // Approve a repository
  approveRepo: async (id) => {
    const response = await api.put(`/repositories/${id}/approve`);
    return response.data;
  },

  // Reject a repository with a note
  rejectRepo: async (id, note) => {
    const response = await api.put(`/repositories/${id}/reject`, { note });
    return response.data;
  }
};

export default approvalService;
