import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import useAuth from './useAuth'
import { requestNotificationPermission, onMessageListener } from '../firebase/messaging'

/**
 * usePushNotifications — activates FCM push notifications for authenticated users.
 *
 * - Requests browser notification permission on mount (when user is logged in)
 * - Listens for foreground messages and displays them as toast popups
 * - Exposes `notificationPermission` so UI components can reflect the current status
 */
const usePushNotifications = () => {
  const { currentUser } = useAuth()
  const [notificationPermission, setNotificationPermission] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  )

  // Request permission and register FCM token when user logs in
  useEffect(() => {
    if (!currentUser) return

    const initNotifications = async () => {
      const token = await requestNotificationPermission(currentUser.uid)

      if (token) {
        setNotificationPermission('granted')
        toast.success('🔔 Push notifications enabled!', { duration: 3000 })
      } else {
        // Reflect the actual browser permission state
        setNotificationPermission(
          typeof Notification !== 'undefined' ? Notification.permission : 'default'
        )
      }
    }

    initNotifications()
  }, [currentUser])

  // Listen for foreground messages in a continuous loop
  useEffect(() => {
    if (!currentUser) return

    let active = true

    const listenForMessages = async () => {
      while (active) {
        try {
          const payload = await onMessageListener()
          if (!active) break

          const title = payload?.notification?.title || 'New Notification'
          const body = payload?.notification?.body || ''

          toast.custom(
            (t) => (
              <div
                className={`${
                  t.visible ? 'animate-enter' : 'animate-leave'
                } max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
              >
                <div className="flex-1 w-0 p-4">
                  <div className="flex items-start">
                    <span className="text-2xl mr-3">🔔</span>
                    <div className="ml-1 flex-1">
                      <p className="text-sm font-semibold text-gray-900">{title}</p>
                      {body && (
                        <p className="mt-1 text-sm text-gray-500">{body}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex border-l border-gray-200">
                  <button
                    onClick={() => toast.dismiss(t.id)}
                    className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            ),
            { duration: 6000 }
          )
        } catch (error) {
          console.error('Error listening for push messages:', error)
          break
        }
      }
    }

    listenForMessages()

    return () => {
      active = false
    }
  }, [currentUser])

  return { notificationPermission }
}

export default usePushNotifications
