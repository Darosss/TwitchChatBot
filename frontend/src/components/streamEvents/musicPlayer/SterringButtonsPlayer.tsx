import React from "react";

interface SterringButtonsProps {
  playing: boolean;
  togglePlayPauseFn: () => void;
  onNextSongFn: () => void;
}
export default function SterringButtons(props: SterringButtonsProps) {
  const { playing, togglePlayPauseFn, onNextSongFn } = props;
  return (
    <div className="music-player-sterring-wrapper">
      <button
        className={`common-button ${
          playing ? "danger-button" : "primary-button"
        }`}
        onClick={togglePlayPauseFn}
      >
        {playing ? "PAUSE" : "PLAY"}
      </button>
      <button className="common-button primary-button" onClick={onNextSongFn}>
        NEXT &#8594;
      </button>
    </div>
  );
}
