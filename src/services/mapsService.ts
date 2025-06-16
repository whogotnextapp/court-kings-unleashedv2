// Maps service supporting both Apple Maps and Google Maps
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
  private googleMapsApiKey: string;

  constructor() {
    this.isAppleDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    this.googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
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
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
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
      if (this.isAppleDevice) {
        return this.searchWithAppleMaps(location, radius);
      } else {
        return this.searchWithGoogleMaps(location, radius);
      }
    } catch (error) {
      console.error('Search courts error:', error);
      throw error;
    }
  }

  // Apple Maps integration (using MapKit JS)
  private async searchWithAppleMaps(location: MapLocation, radius: number): Promise<Court[]> {
    // Note: This requires MapKit JS to be loaded
    if (typeof window.mapkit === 'undefined') {
      throw new Error('Apple MapKit JS not loaded');
    }

    try {
      const search = new window.mapkit.Search({
        region: new window.mapkit.CoordinateRegion(
          new window.mapkit.Coordinate(location.latitude, location.longitude),
          new window.mapkit.CoordinateSpan(0.01, 0.01)
        )
      });

      const response = await search.search('basketball court');
      
      return response.places.map((place: any, index: number) => ({
        id: `apple_${index}`,
        name: place.name,
        address: place.formattedAddress,
        location: {
          latitude: place.coordinate.latitude,
          longitude: place.coordinate.longitude
        },
        rating: 4.0, // Apple Maps doesn't provide ratings in search
        photos: []
      }));
    } catch (error) {
      console.error('Apple Maps search error:', error);
      return [];
    }
  }

  // Google Maps integration
  private async searchWithGoogleMaps(location: MapLocation, radius: number): Promise<Court[]> {
    if (!this.googleMapsApiKey) {
      throw new Error('Google Maps API key not configured');
    }

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?` +
        `location=${location.latitude},${location.longitude}&` +
        `radius=${radius}&` +
        `keyword=basketball+court&` +
        `key=${this.googleMapsApiKey}`
      );

      if (!response.ok) {
        throw new Error('Google Maps API request failed');
      }

      const data = await response.json();
      
      return data.results.map((place: any) => ({
        id: place.place_id,
        name: place.name,
        address: place.vicinity,
        location: {
          latitude: place.geometry.location.lat,
          longitude: place.geometry.location.lng
        },
        rating: place.rating || 4.0,
        photos: place.photos ? place.photos.map((photo: any) => 
          `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${this.googleMapsApiKey}`
        ) : []
      }));
    } catch (error) {
      console.error('Google Maps search error:', error);
      throw error;
    }
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
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${name}`);
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