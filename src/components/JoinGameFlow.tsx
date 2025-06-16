
import React, { useState } from 'react';
import { CheckCircle, MapPin, Users, Clock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface JoinGameFlowProps {
  gameId: string;
  onBack: () => void;
  onJoined: () => void;
}

const JoinGameFlow = ({ gameId, onBack, onJoined }: JoinGameFlowProps) => {
  const [step, setStep] = useState<'confirm' | 'joining' | 'success'>('confirm');

  // Mock game data
  const gameData = {
    courtName: 'Rucker Park',
    address: '155th St & Frederick Douglass Blvd, New York, NY',
    time: '6:00 PM',
    players: 8,
    maxPlayers: 10,
    skillLevel: 'Elite',
    organizer: 'Marcus J.',
    rules: ['First to 21', 'Win by 2', 'Make it take it']
  };

  const handleJoin = () => {
    setStep('joining');
    // Simulate API call
    setTimeout(() => {
      setStep('success');
      setTimeout(() => {
        onJoined();
      }, 2000);
    }, 1500);
  };

  if (step === 'joining') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 brand-gradient">
        <Card className="p-8 text-center glass-effect border-2 border-white/30">
          <div className="animate-spin w-12 h-12 border-4 border-white/30 border-t-white rounded-full mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-white mb-2">Joining Game...</h2>
          <p className="text-white/80">Getting you on the court</p>
        </Card>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 brand-gradient">
        <Card className="p-8 text-center glass-effect border-2 border-white/30 animate-scale-in">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4 animate-bounce-in" />
          <h2 className="text-2xl font-bold text-white mb-2">You're In! 🏀</h2>
          <p className="text-white/80 mb-4">See you on the court at {gameData.time}</p>
          <div className="text-white/60 text-sm">
            Game added to your dashboard
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6 pt-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-bold">Join Game</h1>
      </div>

      {/* Game Details */}
      <Card className="p-4 mb-6">
        <h2 className="text-xl font-bold mb-2">{gameData.courtName}</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{gameData.address}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span className="text-sm">Today at {gameData.time}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="w-4 h-4" />
            <span className="text-sm">{gameData.players}/{gameData.maxPlayers} players</span>
          </div>
        </div>
      </Card>

      {/* Game Rules */}
      <Card className="p-4 mb-6">
        <h3 className="font-semibold mb-3">Game Rules</h3>
        <ul className="space-y-2">
          {gameData.rules.map((rule, index) => (
            <li key={index} className="flex items-center gap-2">
              <div className="w-2 h-2 bg-brand-magenta rounded-full"></div>
              <span className="text-sm">{rule}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Organizer */}
      <Card className="p-4 mb-6">
        <h3 className="font-semibold mb-3">Organized by</h3>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 brand-gradient rounded-full flex items-center justify-center text-white font-bold">
            MJ
          </div>
          <div>
            <div className="font-medium">{gameData.organizer}</div>
            <div className="text-sm text-muted-foreground">Elite Player • 95% Show Rate</div>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="space-y-3 pb-20">
        <Button 
          onClick={handleJoin}
          className="w-full brand-gradient text-white font-bold py-3 hover:scale-105 transition-transform"
        >
          Join Game
        </Button>
        <Button 
          variant="outline" 
          onClick={onBack}
          className="w-full"
        >
          Maybe Next Time
        </Button>
      </div>
    </div>
  );
};

export default JoinGameFlow;
