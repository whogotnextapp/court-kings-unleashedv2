
import React, { useState } from 'react';
import { MapPin, Users, Clock, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

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

interface MapViewProps {
  onJoinGame: (gameId: string) => void;
}

const MapView = ({ onJoinGame }: MapViewProps) => {
  const [selectedGame, setSelectedGame] = useState<GamePin | null>(null);

  const getSkillColor = (level: string) => {
    switch (level) {
      case 'Elite': return 'text-red-500';
      case 'Pro': return 'text-orange-500';
      case 'Rookie': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="relative h-full bg-gray-100">
      {/* Mock Map Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300">
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIwLjEiLz4KPC9zdmc+')] repeat"></div>
        </div>
      </div>

      {/* Game Pins */}
      {mockGames.map((game) => (
        <button
          key={game.id}
          className="absolute animate-bounce-in"
          style={{
            left: `${(game.lng + 74) * 800}px`,
            top: `${(40.77 - game.lat) * 1000}px`,
          }}
          onClick={() => setSelectedGame(game)}
        >
          <div className="relative">
            <MapPin className="w-8 h-8 text-brand-magenta drop-shadow-lg" fill="currentColor" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center text-xs font-bold text-brand-magenta">
              {game.playerCount}
            </div>
          </div>
        </button>
      ))}

      {/* Game Details Card */}
      {selectedGame && (
        <div className="absolute bottom-0 left-0 right-0 p-4 animate-fade-in">
          <Card className="p-4 glass-effect border-2 border-white/30">
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

      {/* Search Bar */}
      <div className="absolute top-4 left-4 right-4">
        <div className="glass-effect rounded-full px-4 py-3">
          <input
            type="text"
            placeholder="Search courts in your area..."
            className="w-full bg-transparent text-white placeholder-white/70 outline-none"
          />
        </div>
      </div>
    </div>
  );
};

export default MapView;
