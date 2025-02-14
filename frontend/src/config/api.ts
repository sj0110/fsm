export const API_URL = import.meta.env.VITE_API_URL;

export const endpoints = {
  auth: {
    login: `${API_URL}/api/auth/login`,
    logout: `${API_URL}/api/auth/logout`,
  },
  services: {
    getAll: `${API_URL}/api/services`,
    getById: (id: string) => `${API_URL}/api/services/${id}`,
    create: `${API_URL}/api/services`,
    update: (id: string) => `${API_URL}/api/services/${id}`,
    delete: (id: string) => `${API_URL}/api/services/${id}`,
  },
  bookings: {
    getAll: `${API_URL}/api/bookings`,
    getById: (id: string) => `${API_URL}/api/bookings/${id}`,
    create: `${API_URL}/api/bookings`,
    update: (id: string) => `${API_URL}/api/bookings/${id}`,
    delete: (id: string) => `${API_URL}/api/bookings/${id}`,
  },
  users: {
    getAll: `${API_URL}/api/users`,
    getAllServiceProviders: `${API_URL}/api/users?role=serviceProvider`,
    getById: (id: string) => `${API_URL}/api/users/${id}`,
    create: `${API_URL}/api/users`,
    update: (id: string) => `${API_URL}/api/users/${id}`,
    delete: (id: string) => `${API_URL}/api/users/${id}`,
  },
};
