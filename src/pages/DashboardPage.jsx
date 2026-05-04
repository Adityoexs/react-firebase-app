import TaskList from '../components/Tasks/TaskList'

/**
 * Protected dashboard page that shows the user's task list.
 * Route: /dashboard  (wrapped in <ProtectedRoute> in App.jsx)
 */
function DashboardPage() {
  return (
    <div>
      <TaskList />
    </div>
  )
}

export default DashboardPage
