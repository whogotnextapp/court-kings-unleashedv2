// src/components/MainLayout.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import MusicPlayer from "./MusicPlayer";
import BottomTabs from "./BottomTabs";

const MainLayout = () => {
  return (
    <div className="flex flex-col h-screen bg-black text-white">
      {/* Scrollable content with padding */}
      <main className="flex-1 overflow-auto pb-40">
        <Outlet />
      </main>

      {/* Music player */}
      <div className="w-full">
        <MusicPlayer />
      </div>

      {/* Bottom tabs - ALWAYS visible */}
      <div className="w-full">
        <BottomTabs />
      </div>
    </div>
  );
};

export default MainLayout;
