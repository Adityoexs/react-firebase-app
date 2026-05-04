// Firestore CRUD helpers for the "tasks" collection using the modular (v9+) SDK
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  orderBy,
} from 'firebase/firestore'
import { db } from './config'

/** Reference to the top-level "tasks" collection */
const tasksRef = collection(db, 'tasks')

/**
 * Create a new task document for the authenticated user.
 * @param {string} userId - UID of the current user.
 * @param {{ title: string, description: string }} data
 * @returns {Promise<DocumentReference>}
 */
export const createTask = (userId, { title, description }) =>
  addDoc(tasksRef, {
    title,
    description,
    userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

/**
 * Update an existing task document.
 * @param {string} taskId - Firestore document ID.
 * @param {{ title: string, description: string }} data
 * @returns {Promise<void>}
 */
export const updateTask = (taskId, { title, description }) =>
  updateDoc(doc(db, 'tasks', taskId), {
    title,
    description,
    updatedAt: serverTimestamp(),
  })

/**
 * Delete a task document.
 * @param {string} taskId - Firestore document ID.
 * @returns {Promise<void>}
 */
export const deleteTask = (taskId) => deleteDoc(doc(db, 'tasks', taskId))

/**
 * Subscribe to real-time updates for a user's tasks (ordered by creation date).
 * @param {string} userId - UID of the current user.
 * @param {function} callback - Receives an array of task objects.
 * @returns {function} Unsubscribe function.
 */
export const subscribeToTasks = (userId, callback) => {
  const q = query(
    tasksRef,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  )

  return onSnapshot(q, (snapshot) => {
    const tasks = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
    callback(tasks)
  })
}
