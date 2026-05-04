import { useEffect, useState } from 'react'
import { subscribeToTasks } from '../firebase/firestore'

/**
 * Real-time hook that subscribes to the current user's tasks in Firestore.
 * Automatically re-renders whenever a task is added, updated, or deleted.
 *
 * @param {string|null} userId - The UID of the currently logged-in user.
 * @returns {{ tasks: Array, loading: boolean, error: string|null }}
 */
const useTasks = (userId) => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Don't subscribe when there is no logged-in user
    if (!userId) {
      setTasks([])
      setLoading(false)
      return
    }

    setLoading(true)

    const unsubscribe = subscribeToTasks(userId, (data) => {
      setTasks(data)
      setLoading(false)
    })

    // Cleanup the Firestore listener when the component unmounts or userId changes
    return unsubscribe
  }, [userId])

  return { tasks, loading, error }
}

export default useTasks
