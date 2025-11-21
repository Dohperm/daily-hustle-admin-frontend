import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { api } from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (token) {
      setIsAuthenticated(true)
      setAdmin({ email: 'admin@example.com', name: 'Admin User' })
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    // Demo login - accept any credentials
    localStorage.setItem('adminToken', 'demo-token')
    setIsAuthenticated(true)
    setAdmin({ email, name: 'Admin User' })
    
    // Navigate to intended page or dashboard
    const from = location.state?.from?.pathname || '/'
    navigate(from, { replace: true })
    
    return { success: true }
  }

  const logout = () => {
    localStorage.removeItem('adminToken')
    setIsAuthenticated(false)
    setAdmin(null)
  }

  const value = {
    isAuthenticated,
    admin,
    login,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}