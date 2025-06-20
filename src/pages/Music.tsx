import React from 'react';
import TabLayout from '@/components/TabLayout';

const Music = () => {
  return (
    <TabLayout>
      <div className="flex flex-col items-center justify-center h-full text-white text-center px-6">
        <h1 className="text-3xl font-bold mb-4">🎵 Music Vibes</h1>
        <p className="text-white/80 mb-8">
          Curated hoops-ready playlists. Get hyped before you run.
        </p>
        <iframe
          className="rounded-xl w-full max-w-md h-80 shadow-lg"
          src="https://open.spotify.com/embed/playlist/37i9dQZF1DX1tyCD9QhIWF?utm_source=generator"
          width="100%"
          height="380"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        ></iframe>
      </div>
    </TabLayout>
  );
};

export default Music;
