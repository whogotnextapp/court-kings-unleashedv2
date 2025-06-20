import React from 'react';
import { useNavigate } from 'react-router-dom';
import { loginWithGoogle } from '@/lib/auth';
import { db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp, GeoPoint } from 'firebase/firestore';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const user = await loginWithGoogle();
      console.log('✅ Logged in user:', user);

      if (!navigator.geolocation) {
        console.error('Geolocation not supported by this browser.');
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          const userRef = doc(db, 'users', user.uid);
          await setDoc(
            userRef,
            {
              name: user.displayName,
              email: user.email,
              photoURL: user.photoURL,
              location: new GeoPoint(latitude, longitude),
              updatedAt: serverTimestamp(),
            },
            { merge: true }
          );

          console.log('📍 User saved to Firestore');
          navigate('/map'); // 🔁 Route to /map after login
        },
        (error) => {
          console.error('Geolocation error:', error.message);
        }
      );
    } catch (err) {
      console.error('❌ Login failed:', err);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <button
        onClick={handleLogin}
        className="px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-xl shadow-lg hover:bg-blue-700"
      >
        Login with Google
      </button>
    </div>
  );
};

export default Login;
