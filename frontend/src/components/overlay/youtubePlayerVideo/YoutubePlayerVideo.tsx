import React, { useEffect, useRef, useState } from "react";

import { useSocketContext } from "@socket";
import SongProgress from "../SongProgress";
import { getYoutubeStreamUrl } from "@services";
import { AudioYTData } from "@socketTypes";
import { useOverlayDataContext } from "../OverlayDataContext";

let progressTimer: NodeJS.Timer; // as global because clear interval doesnt work
//FIXME: later

export default function MusicPlayer() {
  const {
    emits: { getAudioYTData },
    events: { musicYTPause, audioYT, changeYTVolume },
  } = useSocketContext();

  const {
    stylesState: [{ overlayYoutubeMusicPlayer: styles }],
    isEditorState: [isEditor],
  } = useOverlayDataContext();

  const [songDetails, setSongDetails] = useState<AudioYTData>({
    currentTime: 0,
    duration: 0,
    id: "",
    name: "",
    volume: 50,
  });

  const audioPlayer = useRef<HTMLAudioElement>(null);

  const setSongInterval = () => {
    clearInterval(progressTimer);
    progressTimer = setInterval(() => {
      setSongDetails((prevState) => ({
        ...prevState,
        currentTime: prevState.currentTime + 1,
      }));
    }, 1000);
  };

  useEffect(() => {
    if (isEditor)
      setSongDetails((prevState) => ({
        ...prevState,
        id: "djV11Xbc914",
        name: "a-ha - Take On Me",
        duration: 240,
        currentTime: 100,
      }));
  }, [isEditor]);

  useEffect(() => {
    musicYTPause.on(() => {
      audioPlayer.current?.pause();
      clearInterval(progressTimer);
    });

    return () => {
      musicYTPause.off();
    };
  }, [musicYTPause]);

  useEffect(() => {
    audioYT.on((data) => {
      setSongInterval();
      setSongDetails(data);
      audioPlayer.current?.play();
    });

    return () => {
      audioYT.off();
    };
  }, [audioYT]);

  useEffect(() => {
    changeYTVolume.on((volume) => {
      if (!audioPlayer.current) return;
      audioPlayer.current.volume = volume / 100;
    });

    return () => {
      changeYTVolume.off();
    };
  }, [changeYTVolume]);

  useEffect(() => {
    getAudioYTData((isPlaying, cb) => {
      if (!isPlaying) return;
      setSongDetails(cb);
      setSongInterval();
    });

    return () => {
      clearInterval(progressTimer);
    };
    // Disable eslint - it just clearInterval
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (!songDetails.id) return <></>;
  return (
    <div
      className={`youtube-player-wrapper ${songDetails.name ? "" : "hidden"}`}
      style={{ borderRadius: styles.borderRadius }}
    >
      <div
        className="youtube-player-background"
        style={{
          background: styles.background,
          filter: `opacity(${styles.opacity}%)`,
          boxShadow: styles.boxShadow,
        }}
      ></div>
      <div className="youtube-song-details">
        <div
          className="youtube-current-song"
          style={{
            fontSize: styles.currentSong.fontSize,
            color: styles.currentSong.color,
          }}
        >
          {songDetails.name}{" "}
        </div>
        <div className="youtube-song-progress">
          <SongProgress
            songDuration={songDetails.duration || 0}
            currentTime={songDetails.currentTime}
            progressBarProps={{
              labelColor: styles.progressBar.color,
              labelSize: styles.progressBar.fontSize,
              bgColor: styles.progressBar.background,
              baseBgColor: styles.progressBar.baseBackground,
            }}
          />
        </div>
      </div>

      <div className="youtube-player">
        <audio
          ref={audioPlayer}
          src={getYoutubeStreamUrl(songDetails.id)}
          onPlay={(e) => {
            e.currentTarget.volume = songDetails.volume / 100;
          }}
          autoPlay
        />
      </div>
    </div>
  );
}
