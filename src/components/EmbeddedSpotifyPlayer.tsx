
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmbeddedSpotifyPlayerProps {
  trackId?: string;
  playlistId?: string;
  onClose: () => void;
}

const EmbeddedSpotifyPlayer = ({ trackId, playlistId, onClose }: EmbeddedSpotifyPlayerProps) => {
  const embedUrl = trackId 
    ? `https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`
    : `https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0`;

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-black rounded-lg overflow-hidden">
        <Button
          onClick={onClose}
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 z-10 bg-black/50 text-white hover:bg-black/70"
        >
          <X className="w-6 h-6" />
        </Button>
        
        <iframe
          src={embedUrl}
          width="100%"
          height="352"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          title="Spotify Player"
          className="rounded-lg"
        />
      </div>
    </div>
  );
};

export default EmbeddedSpotifyPlayer;
