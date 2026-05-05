// Firebase Cloud Messaging Service Worker
// Handles background push notifications when the app is not in the foreground.
//
// NOTE: Service workers cannot use ES module imports — use importScripts() instead.
// NOTE: Replace the placeholder config values below with your real Firebase project config.

importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js')

// TODO: Replace these placeholder values with your actual Firebase project configuration.
// You can find these values in the Firebase Console → Project Settings → Your apps.
firebase.initializeApp({
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_PROJECT.firebaseapp.com',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_PROJECT.appspot.com',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
})

const messaging = firebase.messaging()

// Handle background messages (app is in background or closed)
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message:', payload)

  const notificationTitle = payload.notification?.title || 'New Notification'
  const notificationOptions = {
    body: payload.notification?.body || '',
    icon: payload.notification?.icon || '/vite.svg',
    badge: '/vite.svg',
    data: payload.data,
  }

  self.registration.showNotification(notificationTitle, notificationOptions)
})
