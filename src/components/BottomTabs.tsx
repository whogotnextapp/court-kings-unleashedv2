// src/components/BottomTabs.tsx
import { NavLink } from "react-router-dom";
import { Music, MapPin, Youtube } from "lucide-react";

const BottomTabs = () => {
  return (
    <nav className="h-16 bg-black border-t border-gray-800 text-white flex justify-around items-center">
      <NavLink
        to="/map"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 ${isActive ? "text-blue-400" : "text-white"}`
        }
        end
      >
        <MapPin className="w-5 h-5" />
        <span className="text-xs">Map</span>
      </NavLink>
      <NavLink
        to="/music"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 ${isActive ? "text-blue-400" : "text-white"}`
        }
      >
        <Music className="w-5 h-5" />
        <span className="text-xs">Music</span>
      </NavLink>
      <NavLink
        to="/podcast"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 ${isActive ? "text-blue-400" : "text-white"}`
        }
      >
        <Youtube className="w-5 h-5" />
        <span className="text-xs">Podcast</span>
      </NavLink>
    </nav>
  );
};

export default BottomTabs;
