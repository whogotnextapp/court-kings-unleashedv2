
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyCaQ3qduw-uk3lweUcdUjobDcsceBgnoto",
  authDomain: "who-got-next-b1ea5.firebaseapp.com",
  projectId: "who-got-next-b1ea5",
  storageBucket: "who-got-next-b1ea5.firebasestorage.app",
  messagingSenderId: "1074416009508",
  appId: "1:1074416009508:web:b67f6bc4a09ca7160db3b1",
  measurementId: "G-RNES3L8WGN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

export { auth, db, storage, analytics };
export default app;
