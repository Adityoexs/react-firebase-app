import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/Auth/ProtectedRoute'
import Navbar from './components/UI/Navbar'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import usePushNotifications from './hooks/usePushNotifications.jsx'

/**
 * Inner layout component — consumes the AuthProvider context so hooks work correctly.
 */
function AppLayout() {
  const { notificationPermission } = usePushNotifications()

  return (
    <>
      {/* Global toast container */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        }}
      />

      {/* Persistent navigation bar — receives notification permission for bell icon */}
      <Navbar notificationPermission={notificationPermission} />

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected route — redirects unauthenticated users to /login */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Fallback: redirect unknown paths to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

/**
 * App — root component that wires together routing, auth context, and toast notifications.
 */
function App() {
  return (
    <AuthProvider>
      <Router>
        <AppLayout />
      </Router>
    </AuthProvider>
  )
}

export default App
