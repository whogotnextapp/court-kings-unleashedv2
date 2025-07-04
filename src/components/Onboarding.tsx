import React from 'react';
import { useNavigate } from 'react-router-dom';
import { loginWithGoogle } from '@/lib/auth';
import { doc, setDoc, serverTimestamp, GeoPoint } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const Onboarding = () => {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const user = await loginWithGoogle();
      console.log('✅ Logged in:', user);

      // Try to get geolocation
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;

            const userRef = doc(db, 'users', user.uid);
            await setDoc(userRef, {
              name: user.displayName,
              email: user.email,
              photoURL: user.photoURL,
              location: new GeoPoint(latitude, longitude),
              updatedAt: serverTimestamp(),
            }, { merge: true });

            console.log('📍 User + location saved to Firestore');
            navigate('/map');
          },
          (error) => {
            console.error('Geolocation error:', error);
            navigate('/map'); // fallback route
          }
        );
      } else {
        console.warn('Geolocation not supported');
        navigate('/map');
      }
    } catch (err) {
      console.error('❌ Login failed:', err);
    }
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-black text-white text-center p-4">
      <h1 className="text-4xl font-bold mb-6">🏀 Who Got Next™</h1>
      <p className="text-lg mb-8">Find pickup games. Build your rep.</p>

      <button
        onClick={handleLogin}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700"
      >
        Sign in with Google
      </button>
    </div>
  );
};

export default Onboarding;
