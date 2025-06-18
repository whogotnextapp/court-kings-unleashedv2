// YouTube API service for podcast integration
export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  duration: string;
  viewCount: string;
  url: string;
}

export interface YouTubeChannel {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  subscriberCount: string;
  videoCount: string;
}

class YouTubeService {
  private apiKey: string;
  private baseUrl = 'https://www.googleapis.com/youtube/v3';

  constructor() {
    this.apiKey = import.meta.env.VITE_YOUTUBE_API_KEY || '';
  }

  // Get channel information
  async getChannelInfo(channelId: string): Promise<YouTubeChannel | null> {
    if (!this.apiKey) {
      console.warn('YouTube API key not configured');
      return null;
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/channels?part=snippet,statistics&id=${channelId}&key=${this.apiKey}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch channel info');
      }

      const data = await response.json();
      
      if (data.items && data.items.length > 0) {
        const channel = data.items[0];
        return {
          id: channel.id,
          title: channel.snippet.title,
          description: channel.snippet.description,
          thumbnail: channel.snippet.thumbnails.high.url,
          subscriberCount: channel.statistics.subscriberCount,
          videoCount: channel.statistics.videoCount
        };
      }

      return null;
    } catch (error) {
      console.error('YouTube channel fetch error:', error);
      return null;
    }
  }

  // Get latest videos from channel
  async getChannelVideos(channelId: string, maxResults: number = 10): Promise<YouTubeVideo[]> {
    if (!this.apiKey) {
      console.warn('YouTube API key not configured');
      return [];
    }

    try {
      // First get the uploads playlist ID
      const channelResponse = await fetch(
        `${this.baseUrl}/channels?part=contentDetails&id=${channelId}&key=${this.apiKey}`
      );

      if (!channelResponse.ok) {
        throw new Error('Failed to fetch channel details');
      }

      const channelData = await channelResponse.json();
      const uploadsPlaylistId = channelData.items[0]?.contentDetails?.relatedPlaylists?.uploads;

      if (!uploadsPlaylistId) {
        throw new Error('No uploads playlist found');
      }

      // Get videos from uploads playlist
      const videosResponse = await fetch(
        `${this.baseUrl}/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=${maxResults}&key=${this.apiKey}`
      );

      if (!videosResponse.ok) {
        throw new Error('Failed to fetch videos');
      }

      const videosData = await videosResponse.json();
      
      // Get additional video details (duration, view count)
      const videoIds = videosData.items.map((item: any) => item.snippet.resourceId.videoId).join(',');
      
      const detailsResponse = await fetch(
        `${this.baseUrl}/videos?part=contentDetails,statistics&id=${videoIds}&key=${this.apiKey}`
      );

      const detailsData = await detailsResponse.json();
      const videoDetails = new Map(detailsData.items.map((item: any) => [item.id, item]));

      return videosData.items.map((item: any) => {
        const videoId = item.snippet.resourceId.videoId;
        const details = videoDetails.get(videoId) as any;
        
        return {
          id: videoId,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default.url,
          publishedAt: item.snippet.publishedAt,
          duration: details?.contentDetails?.duration || '',
          viewCount: details?.statistics?.viewCount || '0',
          url: `https://www.youtube.com/watch?v=${videoId}`
        };
      });
    } catch (error) {
      console.error('YouTube videos fetch error:', error);
      return [];
    }
  }

  // Search for videos
  async searchVideos(query: string, maxResults: number = 10): Promise<YouTubeVideo[]> {
    if (!this.apiKey) {
      console.warn('YouTube API key not configured');
      return [];
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=${maxResults}&key=${this.apiKey}`
      );

      if (!response.ok) {
        throw new Error('Failed to search videos');
      }

      const data = await response.json();
      
      return data.items.map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default.url,
        publishedAt: item.snippet.publishedAt,
        duration: '',
        viewCount: '0',
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`
      }));
    } catch (error) {
      console.error('YouTube search error:', error);
      return [];
    }
  }

  // Open video in YouTube app or web
  openVideo(videoId: string) {
    const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
    
    // Try to open in YouTube app first (mobile)
    if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      window.location.href = `youtube://watch?v=${videoId}`;
      
      // Fallback to web if app doesn't open
      setTimeout(() => {
        window.open(youtubeUrl, '_blank');
      }, 1000);
    } else {
      window.open(youtubeUrl, '_blank');
    }
  }

  // Format duration from ISO 8601 to readable format
  formatDuration(duration: string): string {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return '';

    const hours = (match[1] || '').replace('H', '');
    const minutes = (match[2] || '').replace('M', '');
    const seconds = (match[3] || '').replace('S', '');

    let formatted = '';
    if (hours) formatted += `${hours}:`;
    if (minutes) formatted += `${minutes.padStart(2, '0')}:`;
    formatted += `${seconds.padStart(2, '0')}`;

    return formatted;
  }
}

export const youtubeService = new YouTubeService();
