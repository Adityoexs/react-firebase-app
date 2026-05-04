import { Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

/**
 * Public landing page — shown at the root "/" route.
 * Authenticated users are encouraged to go to their dashboard.
 */
function HomePage() {
  const { currentUser } = useAuth()

  return (
    <main className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center text-center px-4 bg-gradient-to-br from-indigo-50 to-white">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-indigo-700 mb-4">
        🔥 Firebase Tasks
      </h1>
      <p className="text-gray-600 max-w-xl text-lg mb-8">
        A real-time task manager built with React, Firebase, and Tailwind CSS.
        Sign up for free and start organizing your work today.
      </p>

      <div className="flex gap-4 flex-wrap justify-center">
        {currentUser ? (
          <Link
            to="/dashboard"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition text-lg"
          >
            Go to Dashboard →
          </Link>
        ) : (
          <>
            <Link
              to="/register"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition text-lg"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="border border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-semibold px-6 py-3 rounded-xl transition text-lg"
            >
              Sign In
            </Link>
          </>
        )}
      </div>

      {/* Feature highlights */}
      <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl w-full">
        {[
          { icon: '🔐', title: 'Secure Auth', desc: 'Email/password and Google OAuth with protected routes.' },
          { icon: '⚡', title: 'Real-time', desc: 'Firestore onSnapshot keeps your data in sync instantly.' },
          { icon: '🔔', title: 'Notifications', desc: 'Toast alerts for every action so you always know what happened.' },
        ].map(({ icon, title, desc }) => (
          <div key={title} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 text-left">
            <div className="text-3xl mb-2">{icon}</div>
            <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
            <p className="text-sm text-gray-500">{desc}</p>
          </div>
        ))}
      </div>
    </main>
  )
}

export default HomePage
