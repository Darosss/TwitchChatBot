import React, { useState } from "react";

import LocalMusicPlayer from "./LocalMusicPlayer";
import YTMusicPlayer from "./YTMusicPlayer";

type AvailableWindows = "local" | "yt";
export default function MusicPlayer() {
  const [currentWindow, setCurrentWindow] = useState<AvailableWindows>("yt");

  const toggleMusicWindow = () => {
    if (currentWindow === "local") setCurrentWindow("yt");
    else {
      setCurrentWindow("local");
    }
  };

  return (
    <div className="music-player-widget">
      <div className="widget-header">
        {currentWindow === "local" ? "Local" : "YT"} Music player
      </div>
      <div className="music-player-switch-wrapper">
        <button
          className="common-button tertiary-button switch-players-button"
          onClick={() => {
            toggleMusicWindow();
          }}
        >
          Switch to: {currentWindow === "local" ? "YT" : "Local"}
        </button>
      </div>
      {currentWindow === "local" ? <LocalMusicPlayer /> : <YTMusicPlayer />}
    </div>
  );
}
