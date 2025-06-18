
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

// Check if Firebase is properly configured
const isFirebaseConfigured = auth && typeof auth.signInWithEmailAndPassword === 'function';

export const authService = {
  // Sign up new user
  async signUp(email: string, password: string, profile: Partial<UserProfile>) {
    if (!isFirebaseConfigured) {
      console.log('Demo mode: Sign up attempted');
      // Return mock user for demo
      const mockUser = {
        uid: 'demo-user-' + Date.now(),
        email: email,
        displayName: profile.displayName || '',
      };
      const mockProfile: UserProfile = {
        uid: mockUser.uid,
        email: mockUser.email,
        displayName: profile.displayName || '',
        city: profile.city || 'Atlanta',
        skillLevel: 'Wood',
        musicPreference: profile.musicPreference || '',
        wins: 0,
        losses: 0,
        rating: 0,
        tier: 'Wood',
        createdAt: new Date()
      };
      return { user: mockUser, profile: mockProfile };
    }

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
    if (!isFirebaseConfigured) {
      console.log('Demo mode: Sign in attempted');
      // Return mock user for demo
      const mockUser = {
        uid: 'demo-user-signin',
        email: email,
        displayName: 'Demo User',
      };
      const mockProfile: UserProfile = {
        uid: mockUser.uid,
        email: mockUser.email,
        displayName: 'Demo User',
        city: 'Atlanta',
        skillLevel: 'Silver',
        musicPreference: 'Hip-Hop',
        wins: 15,
        losses: 8,
        rating: 1250,
        tier: 'Silver',
        createdAt: new Date()
      };
      return { user: mockUser, profile: mockProfile };
    }

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
    if (!isFirebaseConfigured) {
      console.log('Demo mode: Sign out attempted');
      return;
    }

    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  },

  // Get user profile
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    if (!isFirebaseConfigured) {
      console.log('Demo mode: Get user profile attempted');
      return null;
    }

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
    if (!isFirebaseConfigured) {
      console.log('Demo mode: Auth state listener setup');
      // Call callback with null for demo mode
      callback(null);
      return () => {};
    }

    return onAuthStateChanged(auth, callback);
  }
};
