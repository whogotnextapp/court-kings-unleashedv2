import React, { useState, useEffect } from 'react';
import { Youtube, Play, ExternalLink, Calendar, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { youtubeService, type YouTubeVideo, type YouTubeChannel } from '@/services/youtubeService';
import EmbeddedYouTubePlayer from './EmbeddedYouTubePlayer';

const PodcastPlayer = () => {
  const [channel, setChannel] = useState<YouTubeChannel | null>(null);
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);
  
  const channelId = 'UCRiOQv4UIFUAvyPgh-8g0dw';

  useEffect(() => {
    loadPodcastDataAndAutoplay();
  }, []);

  const loadPodcastDataAndAutoplay = async () => {
    try {
      setIsLoading(true);
      
      const [channelInfo, latestVideos] = await Promise.all([
        youtubeService.getChannelInfo(channelId),
        youtubeService.getChannelVideos(channelId, 10)
      ]);

      setChannel(channelInfo);
      setVideos(latestVideos);

      // Autoplay the latest video
      if (latestVideos.length > 0) {
        setTimeout(() => {
          setCurrentVideoId(latestVideos[0].id);
        }, 1000);
      }
    } catch (error) {
      console.error('Failed to load podcast data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVideoClick = (video: YouTubeVideo) => {
    setCurrentVideoId(video.id);
  };

  const handleClosePlayer = () => {
    setCurrentVideoId(null);
  };

  const formatViewCount = (count: string): string => {
    const num = parseInt(count);
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return count;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  if (isLoading) {
    return (
      <div className="p-4 space-y-6">
        <div className="text-center">
          <Youtube className="w-16 h-16 mx-auto mb-4 text-red-600 animate-pulse" />
          <h2 className="text-2xl font-bold mb-2">Loading Podcast...</h2>
          <p className="text-muted-foreground">Getting the latest episodes</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="text-center">
          <Youtube className="w-12 h-12 mx-auto mb-4 text-red-600" />
          <h1 className="text-2xl font-bold mb-2">2 Tears in a Bucket</h1>
          <p className="text-muted-foreground">Basketball podcast for the culture</p>
        </div>

        {/* Channel Info */}
        {channel && (
          <Card className="p-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                <Youtube className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="font-bold text-lg">{channel.title}</h2>
                <p className="text-sm text-muted-foreground">
                  {parseInt(channel.subscriberCount).toLocaleString()} subscribers • {channel.videoCount} videos
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open(`https://youtube.com/channel/${channelId}`, '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Subscribe
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">{channel.description}</p>
          </Card>
        )}

        {/* Latest Episodes */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Latest Episodes</h2>
          {videos.length > 0 ? (
            videos.map((video) => (
              <Card 
                key={video.id} 
                className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleVideoClick(video)}
              >
                <div className="flex gap-4">
                  <div className="relative w-32 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    {video.thumbnail ? (
                      <img 
                        src={video.thumbnail} 
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Youtube className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/40 transition-colors">
                      <Play className="w-8 h-8 text-white" />
                    </div>
                    {video.duration && (
                      <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
                        {youtubeService.formatDuration(video.duration)}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm line-clamp-2 mb-2">
                      {video.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                      {video.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {formatViewCount(video.viewCount)} views
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(video.publishedAt)}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-8 text-center">
              <Youtube className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="font-semibold mb-2">No episodes found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Check back later for new episodes
              </p>
              <Button 
                variant="outline"
                onClick={() => window.open('https://youtube.com/@2tearsinabucketpodcast707', '_blank')}
              >
                Visit Channel
              </Button>
            </Card>
          )}
        </div>

        {/* YouTube Integration Notice */}
        <Card className="p-4 bg-red-50">
          <div className="text-center">
            <Youtube className="w-8 h-8 mx-auto mb-2 text-red-600" />
            <h3 className="font-semibold mb-2">Watch on YouTube</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Tap any episode to watch on YouTube. Subscribe for notifications on new episodes!
            </p>
            <Button 
              variant="outline" 
              size="sm"
              className="border-red-600 text-red-600 hover:bg-red-50"
              onClick={() => window.open('https://youtube.com/@2tearsinabucketpodcast707', '_blank')}
            >
              <Youtube className="w-4 h-4 mr-2" />
              Subscribe on YouTube
            </Button>
          </div>
        </Card>
      </div>

      {/* Embedded YouTube Player */}
      {currentVideoId && (
        <EmbeddedYouTubePlayer
          videoId={currentVideoId}
          onClose={handleClosePlayer}
          autoplay={true}
        />
      )}
    </>
  );
};

export default PodcastPlayer;
