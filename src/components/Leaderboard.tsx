
import React, { useState } from 'react';
import { Trophy, MapPin, Filter } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Leaderboard = () => {
  const [selectedCity, setSelectedCity] = useState('Atlanta');

  const cities = ['Atlanta', 'Decatur', 'Marietta', 'East Point'];
  
  const leaderboardData = [
    { rank: 1, name: 'Marcus Johnson', wins: 89, winRate: 94, rating: 9.8, avatar: 'MJ', tier: 'Legend' },
    { rank: 2, name: 'DeShawn Williams', wins: 76, winRate: 91, rating: 9.5, avatar: 'DW', tier: 'Platinum' },
    { rank: 3, name: 'John Doe', wins: 73, winRate: 85, rating: 8.4, avatar: 'JD', tier: 'Silver' },
    { rank: 4, name: 'Anthony Davis', wins: 68, winRate: 82, rating: 8.1, avatar: 'AD', tier: 'Silver' },
    { rank: 5, name: 'Kevin Thompson', wins: 61, winRate: 79, rating: 7.9, avatar: 'KT', tier: 'Bronze' },
    { rank: 6, name: 'Jamal Carter', wins: 58, winRate: 76, rating: 7.6, avatar: 'JC', tier: 'Bronze' },
  ];

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'text-yellow-500';
      case 2: return 'text-gray-400';
      case 3: return 'text-amber-600';
      default: return 'text-gray-600';
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank <= 3) {
      return <Trophy className={`w-5 h-5 ${getRankColor(rank)} fill-current`} />;
    }
    return <span className="text-lg font-bold text-gray-600">#{rank}</span>;
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Legend': return 'bg-purple-600';
      case 'Platinum': return 'bg-slate-300';
      case 'Gold': return 'bg-yellow-500';
      case 'Silver': return 'bg-gray-400';
      case 'Bronze': return 'bg-amber-600';
      case 'Wood': return 'bg-amber-800';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Leaderboard</h1>
        <p className="text-muted-foreground">Top players in your city</p>
      </div>

      {/* City Selector */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-5 h-5 text-brand-magenta" />
          <span className="font-semibold">City</span>
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {cities.map((city) => (
            <Button
              key={city}
              variant={selectedCity === city ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCity(city)}
              className={selectedCity === city ? "brand-gradient text-white" : ""}
            >
              {city}
            </Button>
          ))}
        </div>
      </Card>

      {/* Leaderboard */}
      <div className="space-y-3">
        {leaderboardData.map((player, index) => (
          <Card key={index} className={`p-4 transition-all hover:shadow-lg ${player.rank === 3 ? 'ring-2 ring-brand-magenta' : ''}`}>
            <div className="flex items-center gap-4">
              {/* Rank */}
              <div className="flex items-center justify-center w-10">
                {getRankIcon(player.rank)}
              </div>

              {/* Avatar */}
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                player.rank === 3 ? 'brand-gradient' : 'bg-gray-500'
              }`}>
                {player.avatar}
              </div>

              {/* Player Info */}
              <div className="flex-1">
                <div className="font-semibold">{player.name}</div>
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  {player.wins} wins • {player.winRate}% win rate
                  <span className={`px-2 py-1 rounded-full text-xs text-white ${getTierColor(player.tier)}`}>
                    {player.tier}
                  </span>
                </div>
              </div>

              {/* Rating */}
              <div className="text-right">
                <div className="text-lg font-bold text-brand-orange">{player.rating}</div>
                <div className="text-xs text-muted-foreground">rating</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* View More */}
      <Button variant="outline" className="w-full">
        <Filter className="w-4 h-4 mr-2" />
        View Full Rankings
      </Button>
    </div>
  );
};

export default Leaderboard;
