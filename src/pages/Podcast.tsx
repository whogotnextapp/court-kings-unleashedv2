import React from 'react';
import TabLayout from '@/components/TabLayout';

const Podcast = () => {
  return (
    <TabLayout>
      <div className="flex flex-col items-center justify-center h-full text-white text-center px-6">
        <h1 className="text-3xl font-bold mb-4">🎙️ Podcast</h1>
        <p className="text-white/80 mb-8">
          Tune into <strong>2 Tears in a Bucket</strong> — raw convos on life, hustle & the court.
        </p>
        <iframe
          className="w-full max-w-md h-80 rounded-xl shadow-lg"
          src="https://www.youtube.com/embed?listType=user_uploads&list=2tearsinabucketpodcast707"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        ></iframe>
      </div>
    </TabLayout>
  );
};

export default Podcast;
