import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp,
  GeoPoint
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Game {
  id?: string;
  courtName: string;
  address: string;
  location: GeoPoint;
  organizerId: string;
  organizerName: string;
  startTime: Timestamp;
  endTime: Timestamp;
  maxPlayers: number;
  currentPlayers: string[];
  skillLevel: 'Rookie' | 'Pro' | 'Elite';
  rules: string[];
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  createdAt: Timestamp;
}

export interface Court {
  id?: string;
  name: string;
  address: string;
  location: GeoPoint;
  rating: number;
  amenities: string[];
  photos: string[];
  createdAt: Timestamp;
}

export const gameService = {
  // Create a new game
  async createGame(gameData: Omit<Game, 'id' | 'createdAt'>) {
    try {
      const docRef = await addDoc(collection(db, 'games'), {
        ...gameData,
        createdAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Create game error:', error);
      throw error;
    }
  },

  // Get games near location
  async getGamesNearLocation(lat: number, lng: number, radiusKm: number = 10) {
    try {
      // Note: For production, you'd want to use a geohash library for efficient geo queries
      const gamesRef = collection(db, 'games');
      const q = query(
        gamesRef,
        where('status', '==', 'upcoming'),
        orderBy('startTime', 'asc'),
        limit(50)
      );
      
      const querySnapshot = await getDocs(q);
      const games: Game[] = [];
      
      querySnapshot.forEach((doc) => {
        const gameData = doc.data() as Game;
        gameData.id = doc.id;
        
        // Simple distance calculation (for production, use proper geospatial queries)
        const gameLat = gameData.location.latitude;
        const gameLng = gameData.location.longitude;
        const distance = this.calculateDistance(lat, lng, gameLat, gameLng);
        
        if (distance <= radiusKm) {
          games.push(gameData);
        }
      });
      
      return games;
    } catch (error) {
      console.error('Get games error:', error);
      throw error;
    }
  },

  // Join a game
  async joinGame(gameId: string, userId: string) {
    try {
      const gameRef = doc(db, 'games', gameId);
      const gameSnap = await getDoc(gameRef);
      
      if (!gameSnap.exists()) {
        throw new Error('Game not found');
      }
      
      const gameData = gameSnap.data() as Game;
      
      if (gameData.currentPlayers.includes(userId)) {
        throw new Error('Already joined this game');
      }
      
      if (gameData.currentPlayers.length >= gameData.maxPlayers) {
        throw new Error('Game is full');
      }
      
      await updateDoc(gameRef, {
        currentPlayers: [...gameData.currentPlayers, userId]
      });
      
      return true;
    } catch (error) {
      console.error('Join game error:', error);
      throw error;
    }
  },

  // Leave a game
  async leaveGame(gameId: string, userId: string) {
    try {
      const gameRef = doc(db, 'games', gameId);
      const gameSnap = await getDoc(gameRef);
      
      if (!gameSnap.exists()) {
        throw new Error('Game not found');
      }
      
      const gameData = gameSnap.data() as Game;
      const updatedPlayers = gameData.currentPlayers.filter(id => id !== userId);
      
      await updateDoc(gameRef, {
        currentPlayers: updatedPlayers
      });
      
      return true;
    } catch (error) {
      console.error('Leave game error:', error);
      throw error;
    }
  },

  // Calculate distance between two points (Haversine formula)
  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the Earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c; // Distance in km
    return d;
  },

  deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }
};