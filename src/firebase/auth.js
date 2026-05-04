// Firebase Authentication helpers using the modular (v9+) SDK
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { auth } from './config'

// Google OAuth provider instance
const googleProvider = new GoogleAuthProvider()

/**
 * Register a new user with email and password.
 * @param {string} email
 * @param {string} password
 */
export const registerWithEmail = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password)

/**
 * Sign in an existing user with email and password.
 * @param {string} email
 * @param {string} password
 */
export const loginWithEmail = (email, password) =>
  signInWithEmailAndPassword(auth, email, password)

/**
 * Sign in with Google via a popup window.
 */
export const loginWithGoogle = () => signInWithPopup(auth, googleProvider)

/**
 * Sign out the currently authenticated user.
 */
export const logout = () => signOut(auth)

/**
 * Subscribe to authentication state changes.
 * @param {function} callback - Receives the Firebase User object (or null).
 * @returns {function} Unsubscribe function.
 */
export const subscribeToAuthChanges = (callback) =>
  onAuthStateChanged(auth, callback)
