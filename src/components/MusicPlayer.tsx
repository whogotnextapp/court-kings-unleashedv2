import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { musicService, type Song, type Playlist } from '@/services/musicService';
import EmbeddedSpotifyPlayer from './EmbeddedSpotifyPlayer';

const MusicPlayer = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);
  const [playlistTracks, setPlaylistTracks] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSpotifyPlayer, setShowSpotifyPlayer] = useState(false);
  const [spotifyContent, setSpotifyContent] = useState<{trackId?: string, playlistId?: string}>({});

  useEffect(() => {
    loadPlaylists();
  }, []);

  const loadPlaylists = async () => {
    try {
      setIsLoading(true);
      const basketballPlaylists = await musicService.getBasketballPlaylists();
      setPlaylists(basketballPlaylists);
      
      if (basketballPlaylists.length > 0) {
        const defaultPlaylist = basketballPlaylists[0];
        setCurrentPlaylist(defaultPlaylist);
        await loadPlaylistTracksAndAutoplay(defaultPlaylist.id);
      }
    } catch (error) {
      console.error('Failed to load playlists:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadPlaylistTracksAndAutoplay = async (playlistId: string) => {
    try {
      const tracks = await musicService.getPlaylistTracks(playlistId);
      setPlaylistTracks(tracks);
      
      if (tracks.length > 0) {
        const firstTrack = tracks[0];
        setCurrentSong(firstTrack);
        setIsPlaying(true);
        
        // Show embedded Spotify player
        setTimeout(() => {
          setSpotifyContent({ playlistId });
          setShowSpotifyPlayer(true);
        }, 1000);
      }
    } catch (error) {
      console.error('Failed to load playlist tracks:', error);
    }
  };

  const handlePlaySong = async (song: Song) => {
    setCurrentSong(song);
    setIsPlaying(true);
    setSpotifyContent({ trackId: song.id });
    setShowSpotifyPlayer(true);
  };

  const handlePlayPlaylist = (playlist: Playlist) => {
    setCurrentPlaylist(playlist);
    loadPlaylistTracks(playlist.id);
    setSpotifyContent({ playlistId: playlist.id });
    setShowSpotifyPlayer(true);
  };

  const handleCloseSpotifyPlayer = () => {
    setShowSpotifyPlayer(false);
    setIsPlaying(false);
  };

  const loadPlaylistTracks = async (playlistId: string) => {
    try {
      const tracks = await musicService.getPlaylistTracks(playlistId);
      setPlaylistTracks(tracks);
      
      // Set first track as current if available
      if (tracks.length > 0) {
        setCurrentSong(tracks[0]);
      }
    } catch (error) {
      console.error('Failed to load playlist tracks:', error);
    }
  };

  const handlePlayPause = () => {
    if (currentSong) {
      musicService.openSong(currentSong);
      setIsPlaying(!isPlaying);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 space-y-6">
        <div className="text-center">
          <Music className="w-16 h-16 mx-auto mb-4 text-brand-magenta animate-pulse" />
          <h2 className="text-2xl font-bold mb-2">Loading Your Playlist...</h2>
          <p className="text-muted-foreground">Getting ready to play your basketball beats</p>
        </div>
      </div>
    );
  }

  return (
    <>
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
              <div className="w-16 h-16 bg-white/20 rounded-lg overflow-hidden">
                {currentSong.artwork ? (
                  <img 
                    src={currentSong.artwork} 
                    alt={currentSong.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Music className="w-8 h-8" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-bold">{currentSong.title}</h3>
                <p className="text-white/80">{currentSong.artist}</p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:bg-white/20"
                onClick={() => musicService.openSong(currentSong)}
              >
                <ExternalLink className="w-5 h-5" />
              </Button>
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

        {/* Current Playlist Tracks */}
        {playlistTracks.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Current Playlist</h2>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {playlistTracks.map((track, index) => (
                <Card 
                  key={track.id} 
                  className={`p-3 hover:shadow-md transition-shadow cursor-pointer ${
                    currentSong?.id === track.id ? 'ring-2 ring-brand-magenta' : ''
                  }`}
                  onClick={() => handlePlaySong(track)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                      {track.artwork ? (
                        <img 
                          src={track.artwork} 
                          alt={track.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Music className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm truncate">{track.title}</h4>
                      <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {musicService.formatDuration(track.duration)}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Playlists */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Basketball Playlists</h2>
          {playlists.map((playlist) => (
            <Card key={playlist.id} className="p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-brand-gradient rounded-lg overflow-hidden">
                  {playlist.artwork ? (
                    <img 
                      src={playlist.artwork} 
                      alt={playlist.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Music className="w-8 h-8 text-white" />
                    </div>
                  )}
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
                  onClick={() => handlePlayPlaylist(playlist)}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Play
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Spotify Integration Notice */}
        <Card className="p-4 bg-green-50">
          <div className="text-center">
            <Volume2 className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <h3 className="font-semibold mb-2">Powered by Spotify</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Tap any song to open it in Spotify for full playback control
            </p>
            <Button 
              variant="outline" 
              size="sm"
              className="border-green-600 text-green-600 hover:bg-green-50"
              onClick={() => window.open('https://open.spotify.com/', '_blank')}
            >
              Open Spotify
            </Button>
          </div>
        </Card>
      </div>

      {/* Embedded Spotify Player */}
      {showSpotifyPlayer && (
        <EmbeddedSpotifyPlayer
          trackId={spotifyContent.trackId}
          playlistId={spotifyContent.playlistId}
          onClose={handleCloseSpotifyPlayer}
        />
      )}
    </>
  );
};

export default MusicPlayer;
