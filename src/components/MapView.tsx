
import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Clock, Star } from 'lucide-react';

interface GamePin {
  id: string;
  lat: number;
  lng: number;
  courtName: string;
  playerCount: number;
  maxPlayers: number;
  skillLevel: 'Rookie' | 'Pro' | 'Elite';
  startTime: string;
  rating: number;
}

const mockGames: GamePin[] = [
  {
    id: '1',
    lat: 40.7580,
    lng: -73.9855,
    courtName: 'Rucker Park',
    playerCount: 8,
    maxPlayers: 10,
    skillLevel: 'Elite',
    startTime: '6:00 PM',
    rating: 4.8
  },
  {
    id: '2',
    lat: 40.7614,
    lng: -73.9776,
    courtName: 'Marcus Garvey Park',
    playerCount: 4,
    maxPlayers: 8,
    skillLevel: 'Pro',
    startTime: '7:30 PM',
    rating: 4.5
  },
  {
    id: '3',
    lat: 40.7505,
    lng: -73.9934,
    courtName: 'West 4th Street Courts',
    playerCount: 6,
    maxPlayers: 10,
    skillLevel: 'Rookie',
    startTime: '5:00 PM',
    rating: 4.2
  }
];

const containerStyle = {
  width: '100%',
  height: '100vh'
};

const defaultCenter = {
  lat: 40.7580,
  lng: -73.9855
};

const MapView = ({ onJoinGame }: { onJoinGame: (gameId: string) => void }) => {
  const [selectedGame, setSelectedGame] = useState<GamePin | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
        }
      );
    }
  }, []);

  const getSkillColor = (level: string) => {
    switch (level) {
      case 'Elite':
        return 'text-red-500';
      case 'Pro':
        return 'text-orange-500';
      case 'Rookie':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={userLocation || defaultCenter}
        zoom={13}
      >
        {/* Game Pins */}
        {mockGames.map((game) => (
          <Marker
            key={game.id}
            position={{ lat: game.lat, lng: game.lng }}
            onClick={() => setSelectedGame(game)}
          />
        ))}

        {/* User Blue Dot */}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={{
              url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
            }}
          />
        )}
      </GoogleMap>

      {/* Game Info Card */}
      {selectedGame && (
        <div className="absolute bottom-0 left-0 right-0 p-4 animate-fade-in z-50">
          <Card className="p-4 glass-effect border-2 border-white/30 bg-black/70">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-lg text-white">{selectedGame.courtName}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-white text-sm">{selectedGame.rating}</span>
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
                <span className="text-sm">{selectedGame.playerCount}/{selectedGame.maxPlayers}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{selectedGame.startTime}</span>
              </div>
            </div>
            <Button
              onClick={() => onJoinGame(selectedGame.id)}
              className="w-full brand-gradient text-white font-bold hover:scale-105 transition-transform"
            >
              Join Game
            </Button>
          </Card>
        </div>
      )}
    </LoadScript>
  );
};

export default MapView;

