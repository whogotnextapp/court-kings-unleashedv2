
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  city: string;
  skillLevel: string;
  musicPreference: string;
  wins: number;
  losses: number;
  rating: number;
  tier: string;
  createdAt: Date;
}

export const authService = {
  // Sign up new user
  async signUp(email: string, password: string, profile: Partial<UserProfile>) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update display name
      if (profile.displayName) {
        await updateProfile(user, { displayName: profile.displayName });
      }

      // Create user profile in Firestore
      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email!,
        displayName: profile.displayName || '',
        city: profile.city || 'Atlanta',
        skillLevel: 'Wood', // Start at lowest tier
        musicPreference: profile.musicPreference || '',
        wins: 0,
        losses: 0,
        rating: 0,
        tier: 'Wood',
        createdAt: new Date()
      };

      await setDoc(doc(db, 'users', user.uid), userProfile);
      return { user, profile: userProfile };
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  },

  // Sign in existing user
  async signIn(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userProfile = await this.getUserProfile(userCredential.user.uid);
      return { user: userCredential.user, profile: userProfile };
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  },

  // Sign out
  async signOut() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  },

  // Get user profile
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data() as UserProfile;
      }
      return null;
    } catch (error) {
      console.error('Get user profile error:', error);
      throw error;
    }
  },

  // Listen to auth state changes
  onAuthStateChanged(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  }
};
