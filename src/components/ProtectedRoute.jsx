import { useAuth } from '../context/AuthContext'
import Login from './Login'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  if (!isAuthenticated) {
    return <Login />
  }

  return children
}

export default ProtectedRoute