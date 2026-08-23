import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

function parseToken(token) {
  try {
    // JWT payload is the second segment, base64-encoded
    return JSON.parse(atob(token.split('.')[1]))
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token')
    if (!token) return null
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        return { token, ...JSON.parse(savedUser) }
      } catch {
        localStorage.removeItem('user')
      }
    }
    const payload = parseToken(token)
    return payload ? { token, id: payload.id, role: payload.role } : null
  })

  const isAuthenticated = user !== null
  const isAdmin = user?.role === 'admin'

  const login = (token, userInfo = null) => {
    const payload = parseToken(token)
    if (!payload) return
    const authenticatedUser = userInfo ?? { id: payload.id, role: payload.role }
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(authenticatedUser))
    setUser({ token, ...authenticatedUser })
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside an AuthProvider')
  return context
}
