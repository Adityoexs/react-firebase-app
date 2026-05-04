import { useState } from 'react'
import useAuth from '../../hooks/useAuth'
import useTasks from '../../hooks/useTasks'
import TaskItem from './TaskItem'
import TaskForm from './TaskForm'

/**
 * TaskList — the main task dashboard panel.
 * Shows a real-time list of the user's tasks and a button to open the creation form.
 */
function TaskList() {
  const { currentUser } = useAuth()
  const { tasks, loading } = useTasks(currentUser?.uid)
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header row */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">My Tasks</h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
          >
            + Add Task
          </button>
        )}
      </div>

      {/* Inline creation form */}
      {showForm && (
        <TaskForm onClose={() => setShowForm(false)} />
      )}

      {/* Task list */}
      {loading ? (
        <p className="text-center text-gray-400 py-12">Loading tasks…</p>
      ) : tasks.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 text-lg">No tasks yet.</p>
          <p className="text-gray-400 text-sm mt-1">
            Click &ldquo;+ Add Task&rdquo; to get started!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  )
}

export default TaskList
