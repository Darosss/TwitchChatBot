import { SocketContext } from "@context/SocketContext";
import { AudioStreamDataInfo } from "@libs/types";
import { convertSecondsToMS } from "@utils/convertSecondsToMS";

import React, { useContext, useEffect, useState } from "react";
export default function MusicPlayer() {
  const socket = useContext(SocketContext);
  const [playing, setPlaying] = useState(true);
  const [audioData, setAudioData] = useState<AudioStreamDataInfo>();
  const [currentTime, setCurrentTime] = useState(0);

  const showCurrentSongProgress = () => {
    const [maxMinutes, maxSeconds] = convertSecondsToMS(
      audioData?.duration || 0
    );
    const [currMinutes, currSeconds] = convertSecondsToMS(currentTime);

    return (
      <>
        {currMinutes}:{currSeconds} / {maxMinutes}:{maxSeconds}
      </>
    );
  };

  const togglePlayPause = () => {
    if (playing) {
      socket.emit("musicPause");
    } else {
      socket.emit("musicPlay");
    }

    setPlaying(!playing);
  };

  const emitNextSong = () => {
    socket.emit("musicNext");
  };

  useEffect(() => {
    let timer: NodeJS.Timer | undefined;

    const countSongTime = (time: number, duration: number) => {
      setCurrentTime(time);
      time++;
      if (time >= duration) {
        setCurrentTime(0);
        clearInterval(timer);
      }
    };

    socket.on("getAudioInfo", (data) => {
      setAudioData(data);
      let currTime = data.currentTime;
      timer = setInterval(() => {
        currTime++;
        countSongTime(currTime, data.duration);
      }, 1000);
    });

    socket.emit("getAudioInfo");

    return () => {
      socket.off("getAudioInfo");
    };
  }, []);
  return (
    <div className="music-player-widget">
      <div className="widget-header"> Music player </div>
      <div>
        <button
          className={`common-button ${
            playing ? "danger-button" : "primary-button"
          }`}
          onClick={togglePlayPause}
        >
          {playing ? "PAUSE" : "PLAY"}
        </button>
        <button className="common-button primary-button" onClick={emitNextSong}>
          NEXT
        </button>
      </div>
      {audioData ? (
        <div className="audio-data-wrapper">
          <div>{audioData.name}</div>
          <div> {showCurrentSongProgress()} </div>
          <div className="audio-playlist">
            <ul>
              {audioData.songsInQue.map((song, index) => {
                return <li key={index}>{song}</li>;
              })}
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  );
}
