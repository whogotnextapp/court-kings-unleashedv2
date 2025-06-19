
// Maps service supporting Apple Maps with fallback
export interface MapLocation {
  latitude: number;
  longitude: number;
}

export interface MapMarker {
  id: string;
  location: MapLocation;
  title: string;
  subtitle?: string;
  data?: any;
}

export interface Court {
  id: string;
  name: string;
  address: string;
  location: MapLocation;
  rating: number;
  photos?: string[];
}

class MapsService {
  private isAppleDevice: boolean;

  constructor() {
    this.isAppleDevice = /iPad|iPhone|iPod|Mac/.test(navigator.userAgent);
  }

  // Get user's current location
  async getCurrentLocation(): Promise<MapLocation> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('Location obtained:', position.coords);
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }

  // Search for basketball courts near location
  async searchCourtsNearby(location: MapLocation, radius: number = 5000): Promise<Court[]> {
    try {
      console.log('Searching for courts near:', location);
      
      // For now, return mock data based on location
      // This would be replaced with actual Apple Maps search in production
      return this.getMockCourts(location);
      
    } catch (error) {
      console.error('Search courts error:', error);
      return this.getMockCourts(location);
    }
  }

  // Mock courts data for demo
  private getMockCourts(location: MapLocation): Court[] {
    const mockCourts: Court[] = [
      {
        id: 'court_1',
        name: 'Rucker Park',
        address: '155th St & Frederick Douglass Blvd, New York, NY',
        location: {
          latitude: location.latitude + 0.001,
          longitude: location.longitude + 0.001
        },
        rating: 4.8,
        photos: []
      },
      {
        id: 'court_2',
        name: 'Marcus Garvey Park',
        address: 'E 120th St & Madison Ave, New York, NY',
        location: {
          latitude: location.latitude - 0.002,
          longitude: location.longitude + 0.002
        },
        rating: 4.5,
        photos: []
      },
      {
        id: 'court_3',
        name: 'West 4th Street Courts',
        address: 'W 4th St & 6th Ave, New York, NY',
        location: {
          latitude: location.latitude + 0.003,
          longitude: location.longitude - 0.001
        },
        rating: 4.2,
        photos: []
      }
    ];

    console.log('Generated mock courts:', mockCourts);
    return mockCourts;
  }

  // Open directions in native maps app
  openDirections(destination: MapLocation, destinationName?: string) {
    const lat = destination.latitude;
    const lng = destination.longitude;
    const name = destinationName ? encodeURIComponent(destinationName) : '';

    if (this.isAppleDevice) {
      // Open in Apple Maps
      window.open(`maps://maps.apple.com/?daddr=${lat},${lng}&dirflg=w`);
    } else {
      // Open in Google Maps
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`);
    }
  }

  // Calculate distance between two points
  calculateDistance(point1: MapLocation, point2: MapLocation): number {
    const R = 6371; // Radius of Earth in km
    const dLat = this.deg2rad(point2.latitude - point1.latitude);
    const dLng = this.deg2rad(point2.longitude - point1.longitude);
    
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(point1.latitude)) * Math.cos(this.deg2rad(point2.latitude)) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }
}

export const mapsService = new MapsService();
