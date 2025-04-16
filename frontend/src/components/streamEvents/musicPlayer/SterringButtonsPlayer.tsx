interface SterringButtonsProps {
  playing: boolean;
  playFn: () => void;
  pauseFn: () => void;
  onNextSongFn: () => void;
}
export default function SterringButtons(props: SterringButtonsProps) {
  const { playing, playFn, pauseFn, onNextSongFn } = props;
  return (
    <div className="music-player-sterring-wrapper">
      <button
        className={`common-button ${
          playing ? "danger-button" : "primary-button"
        }`}
        onClick={() => (playing ? pauseFn() : playFn())}
      >
        {playing ? "PAUSE" : "PLAY"}
      </button>
      <button className="common-button primary-button" onClick={onNextSongFn}>
        NEXT &#8594;
      </button>
    </div>
  );
}
