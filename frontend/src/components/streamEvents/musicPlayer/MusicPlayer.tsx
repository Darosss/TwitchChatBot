import { SocketContext } from "@context/SocketContext";
import { AudioStreamDataInfo } from "@libs/types";
import React, { useContext, useEffect, useState } from "react";
export default function MusicPlayer() {
  const socket = useContext(SocketContext);
  const [playing, setPlaying] = useState(true);
  const [audioData, setAudioData] = useState<AudioStreamDataInfo>();

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
    console.log("test");
    socket.on("getAudioInfo", (data) => {
      setAudioData(data);
    });

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
          <div> {Math.round(audioData.duration)} sec</div>
          <div>
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
