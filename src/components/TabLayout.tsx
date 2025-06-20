import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Music, MapPin, Youtube } from 'lucide-react';

const TabLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  const tabs = [
    { icon: <Music size={24} />, path: '/music' },
    { icon: <Youtube size={24} />, path: '/podcast' },
    { icon: <MapPin size={24} />, path: '/map' }
  ];

  return (
    <div className="relative h-screen w-screen bg-black text-white">
      <div className="absolute inset-0 z-0">{children}</div>
      <nav className="absolute bottom-0 w-full z-50 bg-[#0A0A0A]/90 border-t border-white/10 backdrop-blur-md flex justify-around py-3">
        {tabs.map((tab, idx) => (
          <button
            key={idx}
            onClick={() => navigate(tab.path)}
            className="text-white/80 hover:text-white transition"
          >
            {tab.icon}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default TabLayout;
