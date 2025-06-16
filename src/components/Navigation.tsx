
import React from 'react';
import { MapPin, User, Trophy, Plus } from 'lucide-react';

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const Navigation = ({ currentView, onViewChange }: NavigationProps) => {
  const navItems = [
    { id: 'map', icon: MapPin, label: 'Courts' },
    { id: 'leaderboard', icon: Trophy, label: 'Rankings' },
    { id: 'create', icon: Plus, label: 'Create' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-pb">
      <div className="max-w-sm mx-auto">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all ${
                  isActive 
                    ? 'text-brand-magenta' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className={`w-6 h-6 ${isActive ? 'scale-110' : ''} transition-transform`} />
                <span className="text-xs mt-1 font-medium">{item.label}</span>
                {isActive && (
                  <div className="w-1 h-1 bg-brand-magenta rounded-full mt-1"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Navigation;
