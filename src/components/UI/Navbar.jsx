import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import useAuth from '../../hooks/useAuth'
import { logout } from '../../firebase/auth'

/**
 * Top navigation bar shown on every page.
 * Displays the app name and auth-aware action buttons.
 */
function Navbar() {
  const { currentUser } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('You have been logged out.')
      navigate('/login')
    } catch {
      toast.error('Logout failed. Please try again.')
    }
  }

  return (
    <nav className="bg-indigo-600 text-white shadow-md">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="text-xl font-bold tracking-tight hover:opacity-90">
          🔥 Firebase Tasks
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {currentUser ? (
            <>
              <span className="text-sm hidden sm:block truncate max-w-xs">
                {currentUser.email}
              </span>
              <Link
                to="/dashboard"
                className="text-sm font-medium hover:underline"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm bg-white text-indigo-600 font-semibold px-3 py-1 rounded-lg hover:bg-indigo-50 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium hover:underline"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm bg-white text-indigo-600 font-semibold px-3 py-1 rounded-lg hover:bg-indigo-50 transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
