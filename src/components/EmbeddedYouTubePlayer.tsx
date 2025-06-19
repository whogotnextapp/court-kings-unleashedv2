
import React, { useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmbeddedYouTubePlayerProps {
  videoId: string;
  onClose: () => void;
  autoplay?: boolean;
}

const EmbeddedYouTubePlayer = ({ videoId, onClose, autoplay = true }: EmbeddedYouTubePlayerProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Auto-focus the iframe for better mobile experience
    if (iframeRef.current) {
      iframeRef.current.focus();
    }
  }, []);

  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&rel=0&modestbranding=1&playsinline=1`;

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden">
        <Button
          onClick={onClose}
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 z-10 bg-black/50 text-white hover:bg-black/70"
        >
          <X className="w-6 h-6" />
        </Button>
        
        <iframe
          ref={iframeRef}
          src={embedUrl}
          className="w-full h-full"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          frameBorder="0"
          title="YouTube Video Player"
        />
      </div>
    </div>
  );
};

export default EmbeddedYouTubePlayer;
