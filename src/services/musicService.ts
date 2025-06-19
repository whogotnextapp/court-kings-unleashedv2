// Spotify Web API service
export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  artwork: string;
  duration: number;
  previewUrl?: string;
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
  private spotifyClientId: string;
  private spotifyClientSecret: string;
  private accessToken: string = '';
  private defaultPlaylistId: string;

  constructor() {
    this.spotifyClientId = 'd174a78d7fe148ef980e838859804283';
    this.spotifyClientSecret = '7687ff50102d4b9385ca1f341361ad2d';
    this.defaultPlaylistId = '5xlm8F3QLdJcyS6uKoMYHK';
  }

  // Get Spotify access token using client credentials flow
  async getAccessToken(): Promise<string> {
    if (this.accessToken) {
      return this.accessToken;
    }

    try {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${btoa(`${this.spotifyClientId}:${this.spotifyClientSecret}`)}`
        },
        body: 'grant_type=client_credentials'
      });

      if (!response.ok) {
        throw new Error('Failed to get Spotify access token');
      }

      const data = await response.json();
      this.accessToken = data.access_token;
      
      // Token expires in 1 hour, clear it after 50 minutes
      setTimeout(() => {
        this.accessToken = '';
      }, 50 * 60 * 1000);

      return this.accessToken;
    } catch (error) {
      console.error('Spotify token error:', error);
      return '';
    }
  }

  // Get your main basketball playlist
  async getBasketballPlaylists(): Promise<Playlist[]> {
    try {
      const token = await this.getAccessToken();
      if (!token) {
        console.warn('No Spotify token available');
        return [];
      }

      // Get the specific playlist only
      const playlistResponse = await fetch(
        `https://api.spotify.com/v1/playlists/${this.defaultPlaylistId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!playlistResponse.ok) {
        throw new Error('Failed to fetch playlist');
      }

      const playlistData = await playlistResponse.json();
      
      const playlist: Playlist = {
        id: playlistData.id,
        name: playlistData.name,
        description: playlistData.description || 'Basketball workout playlist',
        artwork: playlistData.images?.[0]?.url || '',
        songs: [],
        duration: playlistData.tracks.total * 180
      };

      return [playlist];
    } catch (error) {
      console.error('Spotify playlists error:', error);
      return [];
    }
  }

  // Get songs from a playlist
  async getPlaylistTracks(playlistId: string): Promise<Song[]> {
    try {
      const token = await this.getAccessToken();
      if (!token) {
        return [];
      }

      const response = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=50`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch playlist tracks');
      }

      const data = await response.json();
      
      return data.items.map((item: any) => ({
        id: item.track.id,
        title: item.track.name,
        artist: item.track.artists.map((artist: any) => artist.name).join(', '),
        album: item.track.album.name,
        artwork: item.track.album.images?.[0]?.url || '',
        duration: Math.floor(item.track.duration_ms / 1000),
        previewUrl: item.track.preview_url,
        spotifyUrl: item.track.external_urls.spotify
      }));
    } catch (error) {
      console.error('Spotify tracks error:', error);
      return [];
    }
  }

  // Search for songs
  async searchSongs(query: string): Promise<Song[]> {
    try {
      const token = await this.getAccessToken();
      if (!token) {
        return [];
      }

      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=20`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to search songs');
      }

      const data = await response.json();
      
      return data.tracks.items.map((track: any) => ({
        id: track.id,
        title: track.name,
        artist: track.artists.map((artist: any) => artist.name).join(', '),
        album: track.album.name,
        artwork: track.album.images?.[0]?.url || '',
        duration: Math.floor(track.duration_ms / 1000),
        previewUrl: track.preview_url,
        spotifyUrl: track.external_urls.spotify
      }));
    } catch (error) {
      console.error('Spotify search error:', error);
      return [];
    }
  }

  // Play a song (opens in Spotify)
  async playSong(songId: string): Promise<boolean> {
    // Since we can't control Spotify playback without premium SDK,
    // we'll open the song in Spotify
    const spotifyUrl = `https://open.spotify.com/track/${songId}`;
    window.open(spotifyUrl, '_blank');
    return true;
  }

  // Open playlist in Spotify
  openPlaylist(playlistId: string) {
    const spotifyUrl = `https://open.spotify.com/playlist/${playlistId}`;
    window.open(spotifyUrl, '_blank');
  }

  // Open song in Spotify
  openSong(song: Song) {
    if (song.spotifyUrl) {
      window.open(song.spotifyUrl, '_blank');
    } else {
      const spotifyUrl = `https://open.spotify.com/track/${song.id}`;
      window.open(spotifyUrl, '_blank');
    }
  }

  // Get default playlist ID
  getDefaultPlaylistId(): string {
    return this.defaultPlaylistId;
  }

  // Fallback playlists if Spotify API fails
  private getFallbackPlaylists(): Playlist[] {
    return [
      {
        id: this.defaultPlaylistId,
        name: 'Court Hype',
        description: 'Your basketball workout playlist',
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
      }
    ];
  }

  // Format duration from seconds to mm:ss
  formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
}

export const musicService = new MusicService();
