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

  const login = async (identifier, password) => {
    try {
      const response = await api.post('/auths/admins/login', { identifier, password })
      
      if (response.data.status === 200 && response.data.data.requiresOTP) {
        return { 
          success: true, 
          requiresOTP: true, 
          message: response.data.data.message 
        }
      }
      
      return { success: false, message: response.data.message }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      }
    }
  }

  const validateLogin = async (identifier, password, token) => {
    try {
      const response = await api.post('/auths/admins/validate-login', { identifier, password, token })
      
      if (response.data.status === 200) {
        const { token: authToken } = response.data.data
        localStorage.setItem('adminToken', authToken)
        setIsAuthenticated(true)
        setAdmin({ email: identifier, name: 'Admin User' })
        
        const from = location.state?.from?.pathname || '/'
        navigate(from, { replace: true })
        
        return { success: true }
      }
      
      return { success: false, message: response.data.message }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'OTP validation failed' 
      }
    }
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
    validateLogin,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}