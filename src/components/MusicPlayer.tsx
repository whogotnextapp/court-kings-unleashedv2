import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { musicService, type Song, type Playlist } from '@/services/musicService';

const MusicPlayer = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPlaylists();
  }, []);

  const loadPlaylists = async () => {
    try {
      setIsLoading(true);
      const basketballPlaylists = await musicService.getBasketballPlaylists();
      setPlaylists(basketballPlaylists);
    } catch (error) {
      console.error('Failed to load playlists:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlaySong = async (song: Song) => {
    try {
      const success = await musicService.playSong(song.id);
      if (success) {
        setCurrentSong(song);
        setIsPlaying(true);
      } else {
        // Fallback to opening in music app
        musicService.openSong(song);
      }
    } catch (error) {
      console.error('Failed to play song:', error);
      musicService.openSong(song);
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    // In a real implementation, this would control the actual playback
  };

  if (isLoading) {
    return (
      <div className="p-4 space-y-6">
        <div className="text-center">
          <Music className="w-16 h-16 mx-auto mb-4 text-brand-magenta animate-pulse" />
          <h2 className="text-2xl font-bold mb-2">Loading Music...</h2>
          <p className="text-muted-foreground">Getting your basketball playlists ready</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center">
        <Music className="w-12 h-12 mx-auto mb-4 text-brand-magenta" />
        <h1 className="text-2xl font-bold mb-2">Court Beats</h1>
        <p className="text-muted-foreground">Music to elevate your game</p>
      </div>

      {/* Current Playing */}
      {currentSong && (
        <Card className="p-4 brand-gradient text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center">
              <Music className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold">{currentSong.title}</h3>
              <p className="text-white/80">{currentSong.artist}</p>
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <SkipBack className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-white/20 w-12 h-12"
              onClick={handlePlayPause}
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <SkipForward className="w-5 h-5" />
            </Button>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <Slider defaultValue={[33]} max={100} step={1} className="w-full" />
            <div className="flex justify-between text-sm text-white/80">
              <span>1:23</span>
              <span>{musicService.formatDuration(currentSong.duration)}</span>
            </div>
          </div>
        </Card>
      )}

      {/* Playlists */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Basketball Playlists</h2>
        {playlists.map((playlist) => (
          <Card key={playlist.id} className="p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-brand-gradient rounded-lg flex items-center justify-center">
                <Music className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold">{playlist.name}</h3>
                <p className="text-sm text-muted-foreground">{playlist.description}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {musicService.formatDuration(playlist.duration)}
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  // In a real implementation, this would load and play the playlist
                  console.log('Playing playlist:', playlist.name);
                }}
              >
                <Play className="w-4 h-4 mr-2" />
                Play
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Apple Music Integration Notice */}
      <Card className="p-4 bg-gray-50">
        <div className="text-center">
          <Volume2 className="w-8 h-8 mx-auto mb-2 text-brand-magenta" />
          <h3 className="font-semibold mb-2">Enhanced Music Experience</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Connect with Apple Music for full playback control and personalized playlists
          </p>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => musicService.initializeAppleMusic()}
          >
            Connect Apple Music
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default MusicPlayer;