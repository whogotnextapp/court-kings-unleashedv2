
import React from 'react';
import { Badge, Award, TrendingUp, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface PlayerProfileProps {
  onUpgrade: () => void;
}

const PlayerProfile = ({ onUpgrade }: PlayerProfileProps) => {
  const badges = [
    { name: 'Clutch Player', icon: '🏀', earned: true },
    { name: 'Team Captain', icon: '👑', earned: true },
    { name: 'Streak Master', icon: '🔥', earned: false },
    { name: 'Court Legend', icon: '⭐', earned: false },
  ];

  const recentGames = [
    { court: 'State Farm Arena Courts', result: 'W', score: '21-18', date: '2 days ago' },
    { court: 'Piedmont Park', result: 'L', score: '15-21', date: '1 week ago' },
    { court: 'Washington Park', result: 'W', score: '21-14', date: '1 week ago' },
  ];

  return (
    <div className="p-4 space-y-6">
      {/* Profile Header */}
      <div className="text-center">
        <div className="relative inline-block mb-4">
          <div className="w-24 h-24 brand-gradient rounded-full flex items-center justify-center text-4xl text-white font-bold">
            JD
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        </div>
        <h2 className="text-2xl font-bold">John Doe</h2>
        <p className="text-muted-foreground">Atlanta, GA</p>
        <div className="flex justify-center gap-4 mt-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-brand-magenta">127</div>
            <div className="text-sm text-muted-foreground">Games</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-brand-orange">73%</div>
            <div className="text-sm text-muted-foreground">Win Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-brand-yellow">8.4</div>
            <div className="text-sm text-muted-foreground">Rating</div>
          </div>
        </div>
      </div>

      {/* Skill Level */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">Skill Tier</h3>
          <Badge className="bg-gray-400 text-white">Silver</Badge>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-brand-gradient h-2 rounded-full" style={{ width: '78%' }}></div>
        </div>
        <p className="text-sm text-muted-foreground mt-2">Win more games to reach Gold tier</p>
      </Card>

      {/* Badges */}
      <Card className="p-4">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-brand-magenta" />
          Badges
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {badges.map((badge, index) => (
            <div
              key={index}
              className={`p-3 rounded-xl border-2 text-center transition-all ${
                badge.earned 
                  ? 'border-brand-magenta bg-brand-magenta/10' 
                  : 'border-gray-200 bg-gray-50 opacity-50'
              }`}
            >
              <div className="text-2xl mb-1">{badge.icon}</div>
              <div className="text-sm font-medium">{badge.name}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Games */}
      <Card className="p-4">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-brand-orange" />
          Recent Games
        </h3>
        <div className="space-y-3">
          {recentGames.map((game, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium">{game.court}</div>
                <div className="text-sm text-muted-foreground">{game.date}</div>
              </div>
              <div className="text-right">
                <div className={`font-bold ${game.result === 'W' ? 'text-green-600' : 'text-red-600'}`}>
                  {game.result}
                </div>
                <div className="text-sm text-muted-foreground">{game.score}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Upgrade Button */}
      <Button 
        onClick={onUpgrade}
        className="w-full brand-gradient text-white font-bold py-3 hover:scale-105 transition-transform"
      >
        <TrendingUp className="w-5 h-5 mr-2" />
        Upgrade to Premium
      </Button>
    </div>
  );
};

export default PlayerProfile;
