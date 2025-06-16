// Apple Music API service
export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  artwork: string;
  duration: number;
  previewUrl?: string;
  appleMusicUrl?: string;
  spotifyUrl?: string;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  artwork: string;
  songs: Song[];
  duration: number;
}

class MusicService {
  private appleMusicToken: string;
  private isAppleDevice: boolean;

  constructor() {
    this.appleMusicToken = import.meta.env.VITE_APPLE_MUSIC_TOKEN || '';
    this.isAppleDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
  }

  // Initialize Apple Music (requires user authorization)
  async initializeAppleMusic(): Promise<boolean> {
    if (!window.MusicKit) {
      console.warn('Apple MusicKit not loaded');
      return false;
    }

    try {
      await window.MusicKit.configure({
        developerToken: this.appleMusicToken,
        app: {
          name: 'Who Got Next',
          build: '1.0.0'
        }
      });

      const music = window.MusicKit.getInstance();
      
      if (!music.isAuthorized) {
        await music.authorize();
      }

      return music.isAuthorized;
    } catch (error) {
      console.error('Apple Music initialization error:', error);
      return false;
    }
  }

  // Get basketball-themed playlists
  async getBasketballPlaylists(): Promise<Playlist[]> {
    const playlists: Playlist[] = [
      {
        id: 'workout-hype',
        name: 'Court Hype',
        description: 'High-energy tracks to get you pumped for the game',
        artwork: 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg',
        songs: [],
        duration: 3600
      },
      {
        id: 'hip-hop-classics',
        name: 'Streetball Classics',
        description: 'Classic hip-hop tracks that define street basketball',
        artwork: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg',
        songs: [],
        duration: 4200
      },
      {
        id: 'warm-up',
        name: 'Pre-Game Warm Up',
        description: 'Perfect beats for warming up before the game',
        artwork: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg',
        songs: [],
        duration: 2400
      }
    ];

    // If Apple Music is available, fetch real playlists
    if (this.isAppleDevice && window.MusicKit) {
      try {
        const music = window.MusicKit.getInstance();
        if (music.isAuthorized) {
          const searchResults = await music.api.search('basketball workout', {
            types: ['playlists'],
            limit: 10
          });

          if (searchResults.playlists) {
            return searchResults.playlists.data.map((playlist: any) => ({
              id: playlist.id,
              name: playlist.attributes.name,
              description: playlist.attributes.description?.standard || '',
              artwork: playlist.attributes.artwork?.url?.replace('{w}x{h}', '400x400') || '',
              songs: [],
              duration: playlist.attributes.durationInMillis / 1000
            }));
          }
        }
      } catch (error) {
        console.error('Apple Music search error:', error);
      }
    }

    return playlists;
  }

  // Search for songs
  async searchSongs(query: string): Promise<Song[]> {
    if (this.isAppleDevice && window.MusicKit) {
      try {
        const music = window.MusicKit.getInstance();
        if (music.isAuthorized) {
          const searchResults = await music.api.search(query, {
            types: ['songs'],
            limit: 20
          });

          if (searchResults.songs) {
            return searchResults.songs.data.map((song: any) => ({
              id: song.id,
              title: song.attributes.name,
              artist: song.attributes.artistName,
              album: song.attributes.albumName,
              artwork: song.attributes.artwork?.url?.replace('{w}x{h}', '300x300') || '',
              duration: song.attributes.durationInMillis / 1000,
              previewUrl: song.attributes.previews?.[0]?.url,
              appleMusicUrl: song.attributes.url
            }));
          }
        }
      } catch (error) {
        console.error('Apple Music search error:', error);
      }
    }

    // Fallback to mock data
    return [
      {
        id: '1',
        title: 'Till I Collapse',
        artist: 'Eminem',
        album: 'The Eminem Show',
        artwork: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg',
        duration: 297,
        previewUrl: '',
        appleMusicUrl: ''
      },
      {
        id: '2',
        title: 'Lose Yourself',
        artist: 'Eminem',
        album: '8 Mile Soundtrack',
        artwork: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg',
        duration: 326,
        previewUrl: '',
        appleMusicUrl: ''
      }
    ];
  }

  // Play a song (if Apple Music is available)
  async playSong(songId: string): Promise<boolean> {
    if (!this.isAppleDevice || !window.MusicKit) {
      return false;
    }

    try {
      const music = window.MusicKit.getInstance();
      if (music.isAuthorized) {
        await music.setQueue({ song: songId });
        await music.play();
        return true;
      }
    } catch (error) {
      console.error('Play song error:', error);
    }

    return false;
  }

  // Open song in Apple Music or Spotify
  openSong(song: Song) {
    if (this.isAppleDevice && song.appleMusicUrl) {
      window.open(song.appleMusicUrl, '_blank');
    } else if (song.spotifyUrl) {
      window.open(song.spotifyUrl, '_blank');
    } else {
      // Search on Apple Music or Spotify
      const query = encodeURIComponent(`${song.title} ${song.artist}`);
      if (this.isAppleDevice) {
        window.open(`https://music.apple.com/search?term=${query}`, '_blank');
      } else {
        window.open(`https://open.spotify.com/search/${query}`, '_blank');
      }
    }
  }

  // Format duration from seconds to mm:ss
  formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
}

export const musicService = new MusicService();