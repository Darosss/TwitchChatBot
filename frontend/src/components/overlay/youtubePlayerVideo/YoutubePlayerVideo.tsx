import React, { useEffect, useRef, useState } from "react";

import { useSocketContext } from "@socket";
import SongProgress from "../SongProgress";
import { getYoutubeStreamUrl } from "@services";
import { AudioYTData } from "@socketTypes";

let progressTimer: NodeJS.Timer; // as global because clear interval doesnt work
//FIXME: later

export default function MusicPlayer() {
  const {
    emits: { getAudioYTData },
    events: { musicYTPause, audioYT, changeYTVolume },
  } = useSocketContext();
  const [songDetails, setSongDetails] = useState<AudioYTData>({
    currentTime: 0,
    duration: 0,
    id: "",
    name: "",
    volume: 50,
  });

  const audioPlayer = useRef<HTMLAudioElement>(null);
  const youtubeWrapperRef = useRef<HTMLDivElement | null>(null);

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

  if (!songDetails.id) return null;
  return (
    <div
      className={`youtube-player-wrapper ${songDetails.name ? "" : "hidden"}`}
      ref={youtubeWrapperRef}
      style={{
        fontSize: `${
          youtubeWrapperRef.current
            ? `${youtubeWrapperRef.current.offsetWidth / 500}rem`
            : "1rem"
        }`,
      }}
    >
      <div className="youtube-player-background"></div>
      <div className="youtube-song-details">
        <div className="youtube-current-song">{songDetails.name} </div>
        <div className="youtube-song-progress">
          <SongProgress
            songDuration={songDetails.duration || 0}
            currentTime={songDetails.currentTime}
          />
        </div>
      </div>

      <div className="youtube-player">
        <audio
          ref={audioPlayer}
          src={getYoutubeStreamUrl(songDetails.id)}
          autoPlay
        />
      </div>
    </div>
  );
}
