import { createContext, useContext, useEffect, useState } from 'react'
import { subscribeToAuthChanges } from '../firebase/auth'

// Create the context with a default value of null
const AuthContext = createContext(null)

/**
 * AuthProvider wraps the entire app and exposes the current Firebase User
 * (or null when logged out) plus a loading flag used to prevent flickering on
 * initial page load while Firebase resolves the persisted session.
 */
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true) // true until first auth check

  useEffect(() => {
    // onAuthStateChanged returns an unsubscribe function — clean up on unmount
    const unsubscribe = subscribeToAuthChanges((user) => {
      setCurrentUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = { currentUser, loading }

  // Don't render children until the initial auth check has completed
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

/**
 * Convenience hook — throws if used outside of <AuthProvider>.
 */
export function useAuthContext() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
