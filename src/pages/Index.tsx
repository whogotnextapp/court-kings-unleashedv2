import React, { useState, useEffect } from 'react';
import { Music, Youtube } from 'lucide-react';
import Layout from '@/components/Layout';
import Onboarding from '@/components/Onboarding';
import MapView from '@/components/MapView'; // ✅ Replace EnhancedMapView here
import PlayerProfile from '@/components/PlayerProfile';
import Leaderboard from '@/components/Leaderboard';
import PremiumUpgrade from '@/components/PremiumUpgrade';
import JoinGameFlow from '@/components/JoinGameFlow';
import MusicPlayer from '@/components/MusicPlayer';
import PodcastPlayer from '@/components/PodcastPlayer';
import Navigation from '@/components/Navigation';

const Index = () => {
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [currentView, setCurrentView] = useState('map');
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);

  useEffect(() => {
    const onboardingComplete = localStorage.getItem('wgn_onboarding_complete');
    setIsFirstTime(!onboardingComplete);
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem('wgn_onboarding_complete', 'true');
    setIsFirstTime(false);
  };

  const handleJoinGame = (gameId: string) => {
    setSelectedGameId(gameId);
  };

  const handleGameJoined = () => {
    setSelectedGameId(null);
    setCurrentView('profile');
  };

  const handleUpgrade = () => {
    setCurrentView('upgrade');
  };

  const handleBackToProfile = () => {
    setCurrentView('profile');
  };

  const handleBackToMap = () => {
    setSelectedGameId(null);
    setCurrentView('map');
  };

  if (isFirstTime) {
    return (
      <Layout>
        <Onboarding onComplete={handleOnboardingComplete} />
      </Layout>
    );
  }

  if (selectedGameId) {
    return (
      <Layout>
        <JoinGameFlow 
          gameId={selectedGameId}
          onBack={handleBackToMap}
          onJoined={handleGameJoined}
        />
      </Layout>
    );
  }

  if (currentView === 'upgrade') {
    return (
      <Layout>
        <PremiumUpgrade onBack={handleBackToProfile} />
      </Layout>
    );
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'map':
        return <MapView onJoinGame={handleJoinGame} />; // ✅ MapView here
      case 'profile':
        return <PlayerProfile onUpgrade={handleUpgrade} />;
      case 'leaderboard':
        return <Leaderboard />;
      case 'music':
        return <MusicPlayer />;
      case 'podcast':
        return <PodcastPlayer />;
      default:
        return <MapView onJoinGame={handleJoinGame} />;
    }
  };

  return (
    <Layout>
      <div className="pb-16">
        {renderCurrentView()}
      </div>
      <Navigation currentView={currentView} onViewChange={setCurrentView} />
    </Layout>
  );
};

export default Index;
