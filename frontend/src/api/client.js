import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5129/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Normalize ASP.NET validation and error responses into readable messages.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      let message = data?.message || data?.title || `Request failed (${status})`;

      if (data?.errors) {
        const validationMessages = Object.values(data.errors).flat();
        if (validationMessages.length > 0) {
          message = validationMessages.join(' ');
        }
      }

      return Promise.reject(new Error(message));
    }

    if (error.request) {
      return Promise.reject(new Error('Unable to reach the server. Is the API running?'));
    }

    return Promise.reject(new Error(error.message || 'An unexpected error occurred'));
  }
);

export default apiClient;
export { API_URL };
