import React from 'react';
import { useNavigate } from 'react-router-dom';
import { loginWithGoogle } from '@/lib/auth';
import { db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp, GeoPoint } from 'firebase/firestore';

const Onboarding = () => {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const user = await loginWithGoogle();
      if (!user) return;

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

            navigate('/map');
          },
          (err) => console.error('Geolocation error:', err)
        );
      } else {
        console.error('Geolocation not supported');
      }
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-[#0A0A0A] text-center px-6">
      <h1 className="text-4xl font-extrabold text-white mb-4">
        Who Got Next<span className="text-sm align-top">™</span>
      </h1>
      <p className="text-[#CCCCCC] text-lg max-w-md">
        Join local pickup basketball games. Build your rep. Track your wins.
      </p>

      <button
        onClick={handleLogin}
        className="mt-10 px-6 py-3 bg-[#316BFF] text-white text-lg font-semibold rounded-xl shadow-md hover:bg-blue-700 transition duration-200"
      >
        Sign in with Google
      </button>
    </div>
  );
};

export default Onboarding;
