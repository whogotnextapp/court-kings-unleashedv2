
import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Users, Clock, Star, Navigation, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { mapsService, type MapLocation, type Court } from '@/services/mapsService';
import { gameService, type Game } from '@/services/gameService';

interface EnhancedMapViewProps {
  onJoinGame: (gameId: string) => void;
}

const EnhancedMapView = ({ onJoinGame }: EnhancedMapViewProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [userLocation, setUserLocation] = useState<MapLocation | null>(null);
  const [courts, setCourts] = useState<Court[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [mapInstance, setMapInstance] = useState<any>(null);

  useEffect(() => {
    initializeMap();
  }, []);

  const initializeMap = async () => {
    try {
      setIsLoading(true);
      console.log('Starting map initialization...');
      
      // Get user's current location first
      const location = await mapsService.getCurrentLocation();
      console.log('User location obtained:', location);
      setUserLocation(location);

      // Search for nearby courts
      const nearbyCourts = await mapsService.searchCourtsNearby(location);
      console.log('Courts found:', nearbyCourts);
      setCourts(nearbyCourts);

      // Get games near location
      try {
        const nearbyGames = await gameService.getGamesNearLocation(
          location.latitude, 
          location.longitude
        );
        setGames(nearbyGames);
      } catch (gameError) {
        console.log('No games service available, continuing without games');
        setGames([]);
      }

      // Initialize Apple Maps if available
      if (window.mapkit && mapRef.current) {
        try {
          // Wait for mapkit to be fully loaded
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const map = new window.mapkit.Map(mapRef.current, {
            region: new window.mapkit.CoordinateRegion(
              new window.mapkit.Coordinate(location.latitude, location.longitude),
              new window.mapkit.CoordinateSpan(0.01, 0.01)
            ),
            showsUserLocation: true,
            showsUserLocationControl: true
          });
          
          setMapInstance(map);
          console.log('Apple Maps initialized successfully');
        } catch (mapError) {
          console.log('Apple Maps initialization failed:', mapError);
        }
      } else {
        console.log('Apple Maps not available, using fallback visualization');
      }

    } catch (error) {
      console.error('Map initialization error:', error);
      setLocationError('Unable to get your location. Please enable location services and refresh.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCourtSelect = (court: Court) => {
    setSelectedCourt(court);
    setSelectedGame(null);
  };

  const handleGameSelect = (game: Game) => {
    setSelectedGame(game);
    setSelectedCourt(null);
  };

  const handleGetDirections = (location: MapLocation, name?: string) => {
    mapsService.openDirections(location, name);
  };

  const getSkillColor = (level: string) => {
    switch (level) {
      case 'Elite': return 'text-red-500';
      case 'Pro': return 'text-orange-500';
      case 'Rookie': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  // Convert lat/lng to screen coordinates for demo
  const getScreenPosition = (location: MapLocation, userLoc: MapLocation, index: number = 0) => {
    if (!userLoc) return { left: '50%', top: '50%' };
    
    // Simple conversion for demo - in production this would use proper map projection
    const latDiff = (location.latitude - userLoc.latitude) * 50000;
    const lngDiff = (location.longitude - userLoc.longitude) * 50000;
    
    return {
      left: `${50 + lngDiff + (index * 5)}%`,
      top: `${50 - latDiff + (index * 3)}%`
    };
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-brand-magenta" />
          <p className="text-muted-foreground">Finding courts near you...</p>
        </div>
      </div>
    );
  }

  if (locationError) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100 p-4">
        <Card className="p-6 text-center max-w-sm">
          <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="font-semibold mb-2">Location Required</h3>
          <p className="text-sm text-muted-foreground mb-4">{locationError}</p>
          <Button onClick={initializeMap} variant="outline">
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative h-full bg-gray-100">
      {/* Apple Maps Container */}
      <div 
        ref={mapRef} 
        className="absolute inset-0"
        style={{ minHeight: '100%' }}
      />
      
      {/* Fallback Map Background if Apple Maps doesn't load */}
      {!mapInstance && (
        <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-blue-100">
          <div className="absolute inset-0 opacity-30">
            <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIwLjEiLz4KPC9zdmc+')] repeat"></div>
          </div>
        </div>
      )}

      {/* User Location Pin */}
      {userLocation && (
        <div 
          className="absolute animate-pulse z-10"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
        </div>
      )}

      {/* Court Pins */}
      {courts.map((court, index) => {
        const position = getScreenPosition(court.location, userLocation!, index);
        return (
          <button
            key={court.id}
            className="absolute animate-bounce-in z-10"
            style={{
              left: position.left,
              top: position.top,
              transform: 'translate(-50%, -100%)'
            }}
            onClick={() => handleCourtSelect(court)}
          >
            <div className="relative">
              <MapPin className="w-6 h-6 text-gray-600 drop-shadow-lg" fill="currentColor" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full flex items-center justify-center text-xs font-bold text-gray-600">
                <Star className="w-2 h-2" />
              </div>
            </div>
          </button>
        );
      })}

      {/* Game Pins */}
      {games.map((game, index) => {
        const gameLocation = { 
          latitude: game.location?.latitude || userLocation!.latitude + (index * 0.001), 
          longitude: game.location?.longitude || userLocation!.longitude + (index * 0.001) 
        };
        const position = getScreenPosition(gameLocation, userLocation!, index + 10);
        
        return (
          <button
            key={game.id}
            className="absolute animate-bounce-in z-10"
            style={{
              left: position.left,
              top: position.top,
              transform: 'translate(-50%, -100%)'
            }}
            onClick={() => handleGameSelect(game)}
          >
            <div className="relative">
              <MapPin className="w-8 h-8 text-brand-magenta drop-shadow-lg" fill="currentColor" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center text-xs font-bold text-brand-magenta">
                {game.currentPlayers?.length || 0}
              </div>
            </div>
          </button>
        );
      })}

      {/* Court Details Card */}
      {selectedCourt && (
        <div className="absolute bottom-0 left-0 right-0 p-4 animate-fade-in z-20">
          <Card className="p-4 glass-effect border-2 border-white/30">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-lg text-white">{selectedCourt.name}</h3>
                <p className="text-white/80 text-sm">{selectedCourt.address}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-white text-sm">{selectedCourt.rating}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedCourt(null)}
                className="text-white/70 hover:text-white"
              >
                ×
              </button>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={() => handleGetDirections(selectedCourt.location, selectedCourt.name)}
                className="flex-1 bg-white/20 text-white border-white/30 hover:bg-white/30"
                variant="outline"
              >
                <Navigation className="w-4 h-4 mr-2" />
                Directions
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Game Details Card */}
      {selectedGame && (
        <div className="absolute bottom-0 left-0 right-0 p-4 animate-fade-in z-20">
          <Card className="p-4 glass-effect border-2 border-white/30">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-lg text-white">{selectedGame.courtName}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-sm font-semibold ${getSkillColor(selectedGame.skillLevel)}`}>
                    {selectedGame.skillLevel}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedGame(null)}
                className="text-white/70 hover:text-white"
              >
                ×
              </button>
            </div>
            
            <div className="flex items-center gap-4 mb-4 text-white/90">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span className="text-sm">{selectedGame.currentPlayers?.length || 0}/{selectedGame.maxPlayers}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span className="text-sm">
                  {selectedGame.startTime?.toDate ? 
                    selectedGame.startTime.toDate().toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    }) : 
                    'TBA'
                  }
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={() => onJoinGame(selectedGame.id!)}
                className="flex-1 brand-gradient text-white font-bold hover:scale-105 transition-transform"
              >
                Join Game
              </Button>
              <Button 
                onClick={() => handleGetDirections(
                  { 
                    latitude: selectedGame.location?.latitude || userLocation!.latitude, 
                    longitude: selectedGame.location?.longitude || userLocation!.longitude 
                  }, 
                  selectedGame.courtName
                )}
                className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                variant="outline"
                size="icon"
              >
                <Navigation className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Search Bar */}
      <div className="absolute top-4 left-4 right-4 z-10">
        <div className="glass-effect rounded-full px-4 py-3">
          <input
            type="text"
            placeholder="Search courts in your area..."
            className="w-full bg-transparent text-white placeholder-white/70 outline-none"
          />
        </div>
      </div>

      {/* Location Button */}
      <div className="absolute top-20 right-4 z-10">
        <Button
          onClick={initializeMap}
          size="icon"
          className="glass-effect border-white/30 text-white hover:bg-white/20"
          variant="outline"
        >
          <MapPin className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default EnhancedMapView;
