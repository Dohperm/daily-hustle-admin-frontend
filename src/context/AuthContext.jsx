import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { api } from '../services/api'

const AuthContext = createContext()

// Global reference to auth context for use in API interceptor
let globalAuthContext = null

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Function to handle session expiry from API interceptor
export const handleSessionExpiry = () => {
  if (globalAuthContext) {
    globalAuthContext.logout()
  }
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
      console.log('Attempting login for:', identifier)
      const response = await api.post('/auths/admins/login', { identifier, password })
      console.log('Login response:', response.data)
      
      if (response.data.status === 200 && response.data.data.requiresOTP) {
        return { 
          success: true, 
          requiresOTP: true, 
          message: response.data.data.message 
        }
      }
      
      return { success: false, message: response.data.message }
    } catch (error) {
      console.error('Login error:', error)
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      }
    }
  }

  const validateLogin = async (identifier, password, token) => {
    try {
      console.log('Attempting OTP validation for:', identifier)
      const response = await api.post('/auths/admins/validate-login', { identifier, password, token })
      console.log('OTP validation response:', response.data)
      
      if (response.data.status === 200) {
        const { token: authToken } = response.data.data
        console.log('Setting auth token and updating state')
        localStorage.setItem('adminToken', authToken)
        setIsAuthenticated(true)
        setAdmin({ email: identifier, name: 'Admin User' })
        
        const from = location.state?.from?.pathname || '/'
        navigate(from, { replace: true })
        
        return { success: true }
      }
      
      return { success: false, message: response.data.message }
    } catch (error) {
      console.error('OTP validation error:', error)
      return { 
        success: false, 
        message: error.response?.data?.message || 'OTP validation failed' 
      }
    }
  }

  const logout = () => {
    console.log('Logout called - clearing auth state')
    localStorage.removeItem('adminToken')
    sessionStorage.clear()
    setIsAuthenticated(false)
    setAdmin(null)
    navigate('/login', { replace: true })
  }

  const value = {
    isAuthenticated,
    admin,
    login,
    validateLogin,
    logout,
    loading
  }

  // Set global reference for API interceptor
  globalAuthContext = value

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}