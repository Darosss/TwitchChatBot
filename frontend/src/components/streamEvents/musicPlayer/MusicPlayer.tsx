import { useCallback, useState } from "react";

import AudioInformation from "./AudioInformation";
import YTMusicPlayer from "./yt/YTMusicPlayer";
import LocalMusicPlayer from "./local/LocalMusicPlayer";
import SterringButtons from "./SterringButtonsPlayer";
import { AddSong } from "./addSong/AddSong";
import { DownloadedSongPlayer, YoutubePlayer } from "@components/musicPlayers";
import useMusicPlayer from "@hooks/useMusicPlayer";
import PlayerOptions from "./PlayerOptions";

enum AvailableWindowsEnum {
  LOCAL = "local",
  YT = "yt",
  ADD_SONG = "add song",
  OPTIONS = "options",
}

export default function MusicPlayer() {
  const [currentWindow, setCurrentWindow] = useState<AvailableWindowsEnum>(
    AvailableWindowsEnum.YT
  );
  const [audioMonitor, setAudioMonitor] = useState(false);

  const {
    audioData,
    isPlaying,
    songsInQue,
    setAudioData,
    emitPlay,
    emitPause,
    emitNext,
    emitChangeVolume,
  } = useMusicPlayer();

  const playersButtons = useCallback(
    () =>
      Object.values(AvailableWindowsEnum).map((window) => (
        <button
          key={window}
          className={`common-button switch-players-button ${
            currentWindow === window ? "primary-button" : "tertiary-button"
          }`}
          onClick={() => setCurrentWindow(window)}
        >
          {window}
        </button>
      )),
    [currentWindow]
  );

  const currentPlayerActions = useCallback(() => {
    switch (currentWindow) {
      case AvailableWindowsEnum.LOCAL:
        return <LocalMusicPlayer />;
      case AvailableWindowsEnum.YT:
        return <YTMusicPlayer />;
      case AvailableWindowsEnum.ADD_SONG:
        return <AddSong />;
      case AvailableWindowsEnum.OPTIONS:
        return (
          <PlayerOptions
            audioMonitor={audioMonitor}
            onChangeAudioMonitor={(value) => {
              setAudioMonitor(value);
            }}
          />
        );
    }
  }, [currentWindow, audioMonitor]);
  return (
    <div className="music-player-widget">
      <div className="widget-header">
        {currentWindow.toUpperCase()} Music player
      </div>
      <div className="music-player-switch-wrapper">{playersButtons()}</div>
      <div className="music-player-current-actions">
        {currentPlayerActions()}
      </div>
      <div className="music-player-steering-buttons">
        <SterringButtons
          playing={isPlaying}
          pauseFn={emitPause}
          playFn={emitPlay}
          onNextSongFn={emitNext}
        />
      </div>
      <div className="music-player-audio-info">
        <AudioInformation
          isPlaying={isPlaying}
          audioServerData={{
            audioData,
            isPlaying,
            songsInQue,
          }}
          setAudioData={setAudioData}
          changeVolumeFn={(value) => {
            emitChangeVolume(value);
          }}
        />
      </div>

      {audioMonitor && audioData.downloadedData && audioData.type !== "yt" ? (
        <DownloadedSongPlayer data={{ audioData, isPlaying, songsInQue }} />
      ) : audioMonitor && audioData.type === "yt" ? (
        <YoutubePlayer isPlaying={isPlaying} songId={audioData.id} />
      ) : null}
    </div>
  );
}
