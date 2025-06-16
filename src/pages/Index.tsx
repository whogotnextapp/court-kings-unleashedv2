
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
    // Clear onboarding to restart from beginning
    localStorage.removeItem('wgn_onboarding_complete');
    setIsFirstTime(true);
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

  const handlePodcastClick = () => {
    window.open('https://youtube.com/@2tearsinabucketpodcast707?si=dsspmNFSjVZ-04ir', '_blank');
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
      case 'music':
        return (
          <div className="p-4 flex items-center justify-center h-full">
            <div className="text-center">
              <Music className="w-16 h-16 mx-auto mb-4 text-brand-magenta" />
              <h2 className="text-2xl font-bold mb-4">Music</h2>
              <p className="text-muted-foreground">Game soundtrack coming soon! 🎵</p>
            </div>
          </div>
        );
      case 'podcast':
        handlePodcastClick();
        return (
          <div className="p-4 flex items-center justify-center h-full">
            <div className="text-center">
              <Youtube className="w-16 h-16 mx-auto mb-4 text-red-600" />
              <h2 className="text-2xl font-bold mb-4">Podcast</h2>
              <p className="text-muted-foreground">Opening 2 Tears in a Bucket...</p>
            </div>
          </div>
        );
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
