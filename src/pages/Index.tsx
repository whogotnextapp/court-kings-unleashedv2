
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Onboarding from '@/components/Onboarding';
import MapView from '@/components/MapView';
import PlayerProfile from '@/components/PlayerProfile';
import Leaderboard from '@/components/Leaderboard';
import PremiumUpgrade from '@/components/PremiumUpgrade';
import JoinGameFlow from '@/components/JoinGameFlow';
import Navigation from '@/components/Navigation';

const Index = () => {
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [currentView, setCurrentView] = useState('map');
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);

  useEffect(() => {
    // Check if user has completed onboarding
    const hasCompletedOnboarding = localStorage.getItem('wgn_onboarding_complete');
    if (hasCompletedOnboarding) {
      setIsFirstTime(false);
    }
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
    setCurrentView('profile'); // Show profile after joining
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

  // Show onboarding for first-time users
  if (isFirstTime) {
    return (
      <Layout>
        <Onboarding onComplete={handleOnboardingComplete} />
      </Layout>
    );
  }

  // Show join game flow
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

  // Show premium upgrade screen
  if (currentView === 'upgrade') {
    return (
      <Layout>
        <PremiumUpgrade onBack={handleBackToProfile} />
      </Layout>
    );
  }

  // Main app views
  const renderCurrentView = () => {
    switch (currentView) {
      case 'map':
        return <MapView onJoinGame={handleJoinGame} />;
      case 'profile':
        return <PlayerProfile onUpgrade={handleUpgrade} />;
      case 'leaderboard':
        return <Leaderboard />;
      case 'create':
        return (
          <div className="p-4 flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Create Game</h2>
              <p className="text-muted-foreground">Coming soon! 🏀</p>
            </div>
          </div>
        );
      default:
        return <MapView onJoinGame={handleJoinGame} />;
    }
  };

  return (
    <Layout>
      <div className="pb-16"> {/* Space for navigation */}
        {renderCurrentView()}
      </div>
      <Navigation currentView={currentView} onViewChange={setCurrentView} />
    </Layout>
  );
};

export default Index;
