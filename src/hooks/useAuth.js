// Convenience re-export so components can import from a single location
import { useAuthContext } from '../context/AuthContext'

/**
 * Returns { currentUser, loading } from the nearest AuthProvider.
 * Usage: const { currentUser } = useAuth()
 */
const useAuth = () => useAuthContext()

export default useAuth
