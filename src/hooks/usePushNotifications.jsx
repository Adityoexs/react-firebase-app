import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import useAuth from './useAuth'
import { requestNotificationPermission, subscribeToForegroundMessages } from '../firebase/messaging'

/**
 * usePushNotifications — activates FCM push notifications for authenticated users.
 *
 * - Requests browser notification permission on mount (when user is logged in)
 * - Sets up a single persistent foreground message listener (cleaned up on unmount)
 * - Displays incoming messages as custom toast popups
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

  // Set up a single persistent foreground message listener; clean it up on unmount
  useEffect(() => {
    if (!currentUser) return

    let unsubscribe = () => {}

    const handleMessage = (payload) => {
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
                <span className="text-2xl mr-3" aria-hidden="true">🔔</span>
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
                aria-label="Close notification"
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none"
              >
                Close
              </button>
            </div>
          </div>
        ),
        { duration: 6000 }
      )
    }

    subscribeToForegroundMessages(handleMessage).then((unsub) => {
      unsubscribe = unsub
    })

    return () => {
      unsubscribe()
    }
  }, [currentUser])

  return { notificationPermission }
}

export default usePushNotifications
