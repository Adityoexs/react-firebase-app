import { Navigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

/**
 * ProtectedRoute wraps any route that requires authentication.
 * If the user is not logged in they are redirected to /login.
 * The `replace` prop replaces the history entry so the user can't "back" into
 * a protected page after logging out.
 */
function ProtectedRoute({ children }) {
  const { currentUser } = useAuth()

  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
