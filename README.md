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
│       └── Navbar.jsx         # Global navigation bar
├── context/
│   └── AuthContext.jsx        # Firebase auth state via React Context API
├── firebase/
│   ├── config.js              # Firebase app initialisation
│   ├── auth.js                # Auth helpers (register, login, Google, logout)
│   └── firestore.js           # Firestore CRUD & real-time helpers
├── hooks/
│   ├── useAuth.js             # Convenience hook — exposes currentUser & loading
│   └── useTasks.js            # Real-time task subscription hook
├── pages/
│   ├── HomePage.jsx           # Public landing page
│   ├── LoginPage.jsx          # /login
│   ├── RegisterPage.jsx       # /register
│   └── DashboardPage.jsx      # /dashboard (protected)
├── App.jsx                    # Router + AuthProvider + Toaster
└── main.jsx                   # React entry point
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
3. Copy your project's web app config

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

> ⚠️ Never commit your `.env` file. It is already listed in `.gitignore`.

---

## 📝 License

MIT