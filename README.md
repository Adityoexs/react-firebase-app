# 🔥 React Firebase App

A fully-featured task manager built with **React + Vite**, **Firebase (v9+ modular SDK)**, **React Router DOM**, and **Tailwind CSS**.

---

## ✨ Features

| Feature | Details |
|---|---|
| 🔐 **Authentication** | Email/Password & Google OAuth, protected routes, auth context |
| 📦 **Firestore CRUD** | Create, Read, Update, Delete tasks — scoped per user |
| ⚡ **Real-time Updates** | `onSnapshot` listener — changes appear instantly without refresh |
| 🔔 **Toast Notifications** | `react-hot-toast` for auth & CRUD feedback |
| 📲 **Push Notifications** | Firebase Cloud Messaging (FCM) for foreground & background push |
| 🎨 **Tailwind CSS** | Utility-first styling throughout |

---

## 🗂 Project Structure

```
src/
├── components/
│   ├── Auth/
│   │   ├── Login.jsx          # Email/password + Google sign-in form
│   │   ├── Register.jsx       # New account creation form
│   │   └── ProtectedRoute.jsx # Redirects unauthenticated users to /login
│   ├── Tasks/
│   │   ├── TaskList.jsx       # Real-time list of user's tasks
│   │   ├── TaskItem.jsx       # Single task with inline edit & delete
│   │   └── TaskForm.jsx       # Create / edit task form
│   └── UI/
│       └── Navbar.jsx         # Global navigation bar (bell icon for notification status)
├── context/
│   └── AuthContext.jsx        # Firebase auth state via React Context API
├── firebase/
│   ├── config.js              # Firebase app initialisation (Auth, Firestore, Messaging)
│   ├── auth.js                # Auth helpers (register, login, Google, logout)
│   ├── firestore.js           # Firestore CRUD & real-time helpers
│   └── messaging.js           # FCM helpers (requestPermission, onMessageListener)
├── hooks/
│   ├── useAuth.js             # Convenience hook — exposes currentUser & loading
│   ├── useTasks.js            # Real-time task subscription hook
│   └── usePushNotifications.jsx # FCM permission + foreground message listener
├── pages/
│   ├── HomePage.jsx           # Public landing page
│   ├── LoginPage.jsx          # /login
│   ├── RegisterPage.jsx       # /register
│   └── DashboardPage.jsx      # /dashboard (protected)
├── App.jsx                    # Router + AuthProvider + Toaster + usePushNotifications
└── main.jsx                   # React entry point
public/
└── firebase-messaging-sw.js   # Service worker for background FCM notifications
```

---

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/react-firebase-app.git
cd react-firebase-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Firebase

Create a Firebase project at <https://console.firebase.google.com/> then:

1. Enable **Authentication** → Email/Password & Google providers
2. Create a **Firestore** database (start in test mode while developing)
3. Enable **Cloud Messaging** in the Firebase Console
4. Copy your project's web app config

Copy the example env file and fill in your credentials:

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
VITE_FIREBASE_VAPID_KEY=your_vapid_key
```

### 4. Run the development server

```bash
npm run dev
```

Open <http://localhost:5173> in your browser.

### 5. Build for production

```bash
npm run build
npm run preview   # preview the production build locally
```

---

## 🔔 Firebase Cloud Messaging (FCM) Setup

### Getting the VAPID Key

1. Open the [Firebase Console](https://console.firebase.google.com/)
2. Select your project → **Project Settings** (gear icon)
3. Go to the **Cloud Messaging** tab
4. Under **Web Push certificates**, click **Generate key pair** (if you don't have one)
5. Copy the **Key pair** value — this is your VAPID key
6. Paste it as `VITE_FIREBASE_VAPID_KEY` in your `.env` file

### Updating the Service Worker Config

The service worker (`public/firebase-messaging-sw.js`) uses a hardcoded Firebase config for background notifications. You must update it with your real Firebase project values:

```js
// public/firebase-messaging-sw.js
firebase.initializeApp({
  apiKey: 'YOUR_ACTUAL_API_KEY',
  authDomain: 'YOUR_PROJECT.firebaseapp.com',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_PROJECT.appspot.com',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
})
```

> ⚠️ The service worker cannot access Vite environment variables — the config must be hardcoded or fetched at runtime.

### Sending a Test Push Notification

**From Firebase Console:**

1. Go to **Engage** → **Messaging** in the Firebase Console
2. Click **New campaign** → **Firebase Notification messages**
3. Fill in a **Notification title** and **text**
4. Under **Target**, select your app and target all users (or a specific FCM token)
5. Click **Review** → **Publish**

**Via FCM HTTP API (curl):**

```bash
curl -X POST https://fcm.googleapis.com/fcm/send \
  -H "Authorization: key=YOUR_SERVER_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "DEVICE_FCM_TOKEN",
    "notification": {
      "title": "Hello!",
      "body": "This is a test push notification."
    }
  }'
```

Replace `YOUR_SERVER_KEY` with your Firebase Cloud Messaging Server key (found in Project Settings → Cloud Messaging) and `DEVICE_FCM_TOKEN` with the token logged/saved when a user grants permission.

### How It Works

| Scenario | Handler |
|---|---|
| App is **open** (foreground) | `onMessage` in `src/firebase/messaging.js` → toast popup via `usePushNotifications` |
| App is **backgrounded or closed** | `public/firebase-messaging-sw.js` → `onBackgroundMessage` → system notification |

---

## 🔐 Firestore Security Rules (recommended)

After development, lock down your Firestore database so users can only access their own data:

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tasks/{taskId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## 🛠 Tech Stack

- [React 18](https://react.dev/)
- [Vite 5](https://vitejs.dev/)
- [Firebase 10](https://firebase.google.com/docs/web/modular-upgrade) (modular v9+ SDK)
- [React Router DOM 6](https://reactrouter.com/)
- [react-hot-toast](https://react-hot-toast.com/)
- [Tailwind CSS 3](https://tailwindcss.com/)

---

## 📄 Environment Variables

| Variable | Description |
|---|---|
| `VITE_FIREBASE_API_KEY` | Firebase Web API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Firestore project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Cloud Messaging sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase App ID |
| `VITE_FIREBASE_VAPID_KEY` | FCM Web Push VAPID key (from Firebase Console → Cloud Messaging) |

> ⚠️ Never commit your `.env` file. It is already listed in `.gitignore`.

---

## 📝 License

MIT