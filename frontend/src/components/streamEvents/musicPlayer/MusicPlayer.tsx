import { SocketContext } from "@context/SocketContext";
import { AudioStreamDataInfo } from "@libs/types";
import { convertSecondsToMS } from "@utils/convertSecondsToMS";

import React, { useContext, useEffect, useState } from "react";
import UploadMp3Form from "./UploadMp3Form";
import AudioFoldersList from "./AudioFoldersList";
import AudioFolderCreate from "./AudioFolderCreate";

type AvailableTabs = "information" | "upload" | "files" | "folders";

export default function MusicPlayer() {
  const socket = useContext(SocketContext);

  const [activeTab, setActiveTab] = useState<AvailableTabs>("information");

  const [playing, setPlaying] = useState(false);
  const [audioData, setAudioData] = useState<AudioStreamDataInfo>();

  const [currentTime, setCurrentTime] = useState(0);

  const [volume, setVolume] = useState<number>(20);

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

  const emitChangeVolume = (e: number) => {
    socket.emit("changeVolume", e);
  };

  const handleOnSetActiveTab = (tab: AvailableTabs) => {
    setActiveTab(tab);
    socket.emit("getAudioInfo");
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
      setPlaying(data.isPlaying);
      setAudioData(data);
      clearInterval(timer);
      let currTime = data.currentTime;
      timer = setInterval(() => {
        currTime++;
        countSongTime(currTime, data.duration);
      }, 1000);
    });

    socket.on("changeVolume", (volume) => {
      setVolume(volume);
    });

    socket.on("audioStop", () => {
      setPlaying(false);
    });

    socket.on("audio", () => {
      setPlaying(true);
    });

    socket.emit("getAudioInfo");

    return () => {
      socket.off("getAudioInfo");
      socket.off("audioStop");
    };
  }, []);

  const audioDataDOM = () => {
    if (!audioData || !audioData.songsInQue) return <></>;
    return (
      <>
        <div className="audio-data-wrapper">
          <div>
            Volume:
            <input
              type="range"
              min={0}
              max={100}
              value={volume}
              onChange={(e) => setVolume(e.target.valueAsNumber)}
              onMouseUp={(e) => emitChangeVolume(e.currentTarget.valueAsNumber)}
            />
            {volume}
          </div>
          <div>Current folder: {audioData.currentFolder}</div>
          <div>{audioData.name}</div>
          <div> {showCurrentSongProgress()} </div>
          <div className="audio-playlist-wrapper">
            {[...audioData.songsInQue].map((song, index) => {
              const [songName, requester] = song;
              return (
                <div key={index} className="audio-playlist-audio-list">
                  <div>{songName}</div>
                  <div>{`${requester ? `${requester}` : `default`}`}</div>
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  };

  const tabButton = (tab: AvailableTabs) => {
    return (
      <button
        className={`${
          activeTab === tab ? "primary-button" : "danger-button"
        } common-button upload-button-show-hide`}
        onClick={() => handleOnSetActiveTab(tab)}
      >
        {tab.toUpperCase()}
      </button>
    );
  };

  const generateMusicPlayerContext = () => {
    switch (activeTab) {
      case "information":
        return audioDataDOM();
      case "upload":
        return <UploadMp3Form />;
      case "files":
        return <AudioFoldersList />;
      case "folders":
        return <AudioFolderCreate />;
    }
  };

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
          NEXT &#8594;
        </button>
      </div>
      <div className="music-player-tabs-wrapper">
        {tabButton("information")}
        {tabButton("upload")}
        {tabButton("files")}
        {tabButton("folders")}
      </div>
      <div className="tab-containter">{generateMusicPlayerContext()}</div>
    </div>
  );
}
