import { useState } from 'react'
import toast from 'react-hot-toast'
import { deleteTask } from '../../firebase/firestore'
import TaskForm from './TaskForm'

/**
 * TaskItem — displays a single task with inline edit and delete controls.
 *
 * Props:
 *   task — task object { id, title, description, createdAt, updatedAt }
 */
function TaskItem({ task }) {
  const [editing, setEditing] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!window.confirm('Delete this task? This action cannot be undone.')) return

    setDeleting(true)
    try {
      await deleteTask(task.id)
      toast.success('Task deleted.')
    } catch (err) {
      console.error(err)
      toast.error('Failed to delete task. Please try again.')
      setDeleting(false)
    }
  }

  // Format a Firestore Timestamp (or Date) to a readable string
  const formatDate = (timestamp) => {
    if (!timestamp) return ''
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  if (editing) {
    return <TaskForm task={task} onClose={() => setEditing(false)} />
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-2">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-800 truncate">{task.title}</h4>
          {task.description && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
              {task.description}
            </p>
          )}
        </div>

        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => setEditing(true)}
            className="text-sm text-indigo-600 hover:underline font-medium"
            aria-label="Edit task"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="text-sm text-red-500 hover:underline font-medium disabled:opacity-50"
            aria-label="Delete task"
          >
            {deleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>

      <p className="text-xs text-gray-400">
        Created: {formatDate(task.createdAt)}
        {task.updatedAt && task.updatedAt !== task.createdAt && (
          <> · Updated: {formatDate(task.updatedAt)}</>
        )}
      </p>
    </div>
  )
}

export default TaskItem
