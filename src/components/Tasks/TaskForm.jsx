import { useState } from 'react'
import toast from 'react-hot-toast'
import { createTask, updateTask } from '../../firebase/firestore'
import useAuth from '../../hooks/useAuth'

/**
 * TaskForm — used for both creating a new task and editing an existing one.
 *
 * Props:
 *   task        — (optional) existing task object; if provided the form is in "edit" mode
 *   onClose     — callback to close/hide the form after save
 */
function TaskForm({ task = null, onClose }) {
  const { currentUser } = useAuth()
  const [title, setTitle] = useState(task?.title ?? '')
  const [description, setDescription] = useState(task?.description ?? '')
  const [submitting, setSubmitting] = useState(false)

  const isEditing = !!task

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!title.trim()) {
      toast.error('Title is required.')
      return
    }

    setSubmitting(true)
    try {
      if (isEditing) {
        await updateTask(task.id, { title: title.trim(), description: description.trim() })
        toast.success('Task updated successfully! ✏️')
      } else {
        await createTask(currentUser.uid, {
          title: title.trim(),
          description: description.trim(),
        })
        toast.success('Task created successfully! ✅')
      }
      onClose()
    } catch (err) {
      console.error(err)
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} task. Please try again.`)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        {isEditing ? 'Edit Task' : 'New Task'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Task title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            placeholder="Optional description…"
          />
        </div>

        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition disabled:opacity-50"
          >
            {submitting ? 'Saving…' : isEditing ? 'Update Task' : 'Add Task'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default TaskForm
