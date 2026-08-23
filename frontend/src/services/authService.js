import { authApi } from './api'

export const register = (name, email, password) =>
  authApi.register(name, email, password)

export const login = (email, password) =>
  authApi.login(email, password)
