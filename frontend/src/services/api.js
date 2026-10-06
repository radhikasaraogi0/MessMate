import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if expired or unauthorized
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register' && currentPath !== '/') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

// Auth Service
export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Mess Service
export const messService = {
  getAllMesses: async () => {
    const response = await api.get('/messes');
    return response.data;
  },
  getMessById: async (id) => {
    const response = await api.get(`/messes/${id}`);
    return response.data;
  },
  registerMess: async (messData) => {
    const response = await api.post('/messes', messData);
    return response.data;
  },
};

// Meal Service
export const mealService = {
  getTodayMeals: async (date, messId) => {
    const params = {};
    if (date) params.date = date;
    if (messId) params.messId = messId;
    const response = await api.get('/meals/today', { params });
    return response.data;
  },
  getWeeklyMenu: async (startDate, messId) => {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (messId) params.messId = messId;
    const response = await api.get('/meals/weekly', { params });
    return response.data;
  },
  getAllMeals: async (params) => {
    const response = await api.get('/meals', { params });
    return response.data;
  },
  getMealById: async (id) => {
    const response = await api.get(`/meals/${id}`);
    return response.data;
  },
  createMeal: async (mealData) => {
    const response = await api.post('/meals', mealData);
    return response.data;
  },
  updateMeal: async (id, mealData) => {
    const response = await api.put(`/meals/${id}`, mealData);
    return response.data;
  },
  deleteMeal: async (id) => {
    const response = await api.delete(`/meals/${id}`);
    return response.data;
  },
};

// Feedback Service
export const feedbackService = {
  submitFeedback: async (feedbackData) => {
    const response = await api.post('/feedback', feedbackData);
    return response.data;
  },
  getMyHistory: async (params) => {
    const response = await api.get('/feedback/my-history', { params });
    return response.data;
  },
  getAllFeedback: async (params) => {
    const response = await api.get('/feedback', { params });
    return response.data;
  },
  getFeedbackById: async (id) => {
    const response = await api.get(`/feedback/${id}`);
    return response.data;
  },
  updateFeedback: async (id, data) => {
    const response = await api.put(`/feedback/${id}`, data);
    return response.data;
  },
  deleteFeedback: async (id) => {
    const response = await api.delete(`/feedback/${id}`);
    return response.data;
  },
};

// Admin Analytics Service
export const analyticsService = {
  getOverview: async () => {
    const response = await api.get('/admin/analytics/overview');
    return response.data;
  },
  getMealRatings: async () => {
    const response = await api.get('/admin/analytics/meal-ratings');
    return response.data;
  },
  getRatingTrend: async (days = 7) => {
    const response = await api.get('/admin/analytics/rating-trend', { params: { days } });
    return response.data;
  },
  getIssues: async () => {
    const response = await api.get('/admin/analytics/issues');
    return response.data;
  },
};

// Student Directory Service (Admin)
export const studentService = {
  getAllStudents: async (params) => {
    const response = await api.get('/admin/students', { params });
    return response.data;
  },
};

export default api;
