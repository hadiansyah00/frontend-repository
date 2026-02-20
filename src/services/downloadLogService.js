import api from './api';

const downloadLogService = {
  // Get paginated download logs
  getLogs: async (params = {}) => {
    // Expected params: page, limit, search
    const response = await api.get('/download-logs', { params });
    return response.data;
  },
  
  // Placeholder for export functionality if needed in the future
  exportLogsToCSV: async (params = {}) => {
    // Needs matching backend endpoint
    const response = await api.get('/download-logs/export', { 
      params,
      responseType: 'blob' 
    });
    return response.data;
  }
};

export default downloadLogService;
