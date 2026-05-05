// Firebase configuration using environment variables (Vite exposes VITE_* variables)
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getMessaging, isSupported } from 'firebase/messaging'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// Initialize Firebase app (singleton)
const app = initializeApp(firebaseConfig)

// Export pre-initialized service instances for use throughout the app
export const auth = getAuth(app)
export const db = getFirestore(app)

// Messaging is only supported in browsers that support service workers.
// Initialise lazily so SSR / unsupported environments don't throw.
export const getFirebaseMessaging = async () => {
  const supported = await isSupported()
  if (!supported) return null
  return getMessaging(app)
}

export default app
