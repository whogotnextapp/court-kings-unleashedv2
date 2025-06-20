import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyBuj8OxbpYMXM6dVb2FBsfUi4zYjND4_iI",
  authDomain: "who-got-next-mobile-app.firebaseapp.com",
  projectId: "who-got-next-mobile-app",
  storageBucket: "who-got-next-mobile-app.appspot.com",
  messagingSenderId: "112358950863",
  appId: "1:112358950863:web:9446adec64785d83bcb4ba",
  measurementId: "G-LTTBE1L5E1"
};

// Initialize app once (handles hot reload)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Analytics (browser only)
let analytics: ReturnType<typeof getAnalytics> | null = null;
if (typeof window !== 'undefined') {
  isSupported().then((enabled) => {
    if (enabled) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, auth, db, storage, analytics };
