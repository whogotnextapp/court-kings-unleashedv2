import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from './firebase'; // ✅ adjust if your firebase file is in a different location

export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error('❌ Google login error:', error);
    throw error;
  }
};
