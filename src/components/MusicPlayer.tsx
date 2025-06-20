import React from 'react';

const MusicPlayer = () => {
  return (
    <div className="w-full h-20 bg-black flex items-center justify-center shadow-lg z-40">
      <iframe
        src="https://open.spotify.com/embed/playlist/5xlm8F3QLdJcyS6uKoMYHK?utm_source=generator&theme=0"
        width="100%"
        height="100%"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        className="rounded-none"
      ></iframe>
    </div>
  );
};

export default MusicPlayer;
