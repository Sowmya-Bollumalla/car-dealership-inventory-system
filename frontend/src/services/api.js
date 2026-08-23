import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
})

// Attach JWT from localStorage to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const authApi = {
  register: (name, email, password) =>
    api.post('/auth/register', { name, email, password }),

  login: (email, password) =>
    api.post('/auth/login', { email, password }),
}

export const vehiclesApi = {
  getAll: () =>
    api.get('/vehicles'),

  search: (params) =>
    api.get('/vehicles/search', { params }),

  create: (data) =>
    api.post('/vehicles', data),

  update: (id, data) =>
    api.put(`/vehicles/${id}`, data),

  remove: (id) =>
    api.delete(`/vehicles/${id}`),

  purchase: (id, quantity = 1) =>
    api.post(`/vehicles/${id}/purchase`, { quantity }),

  restock: (id, quantity) =>
    api.post(`/vehicles/${id}/restock`, { quantity }),
}
