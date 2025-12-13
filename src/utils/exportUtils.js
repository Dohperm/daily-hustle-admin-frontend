import { api } from '../services/api';

export const exportToCSV = async (endpoint, columns, filename = 'export.csv', additionalParams = {}) => {
  try {
    const params = {
      download: true,
      columns: columns.join(','),
      ...additionalParams
    };

    const response = await api.get(endpoint, { 
      params,
      responseType: 'blob'
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    return { success: true };
  } catch (error) {
    console.error('Error exporting data:', error);
    return { success: false, error };
  }
};
