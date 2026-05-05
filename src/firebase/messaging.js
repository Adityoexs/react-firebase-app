// Firebase Cloud Messaging (FCM) helpers — modular v9+ SDK
import { getToken, onMessage } from 'firebase/messaging'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db, getFirebaseMessaging } from './config'

/**
 * Request browser notification permission and retrieve the FCM token.
 * Saves the token to the user's Firestore document (/users/{userId}).
 *
 * @param {string} userId - The authenticated user's UID
 * @returns {Promise<string|null>} The FCM token, or null if permission was denied / unsupported
 */
export const requestNotificationPermission = async (userId) => {
  try {
    // Check if the browser supports the Notifications API
    if (!('Notification' in window)) {
      console.warn('This browser does not support push notifications.')
      return null
    }

    // Check if service workers are supported (required for FCM)
    if (!('serviceWorker' in navigator)) {
      console.warn('Service workers are not supported in this browser.')
      return null
    }

    const messaging = await getFirebaseMessaging()
    if (!messaging) {
      console.warn('Firebase Messaging is not supported in this browser.')
      return null
    }

    const permission = await Notification.requestPermission()

    if (permission !== 'granted') {
      console.warn('Notification permission denied.')
      return null
    }

    const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY

    const serviceWorkerRegistration =
      (await navigator.serviceWorker.getRegistration('/firebase-messaging-sw.js')) ??
      (await navigator.serviceWorker.register('/firebase-messaging-sw.js'))

    const token = await getToken(messaging, {
      vapidKey,
      serviceWorkerRegistration,
    })

    if (token && userId) {
      // Persist the FCM token in Firestore so the server can target this device
      await setDoc(
        doc(db, 'users', userId),
        {
          fcmToken: token,
          fcmTokenUpdatedAt: serverTimestamp(),
        },
        { merge: true }
      )
    }

    return token
  } catch (error) {
    console.error('Error requesting notification permission:', error)
    return null
  }
}

/**
 * Subscribe to foreground messages (app is open/focused).
 * Sets up a single persistent listener and returns an unsubscribe function
 * for proper cleanup.
 *
 * @param {function} callback - Receives the FCM message payload
 * @returns {Promise<function>} Unsubscribe function
 */
export const subscribeToForegroundMessages = async (callback) => {
  const messaging = await getFirebaseMessaging()
  if (!messaging) return () => {}
  // onMessage returns an unsubscribe function
  return onMessage(messaging, callback)
}
