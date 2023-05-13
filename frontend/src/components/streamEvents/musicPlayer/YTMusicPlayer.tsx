import React, { useEffect, useMemo } from "react";
import { SocketContext, AudioYTDataInfo } from "@context/socket";
import { useContext, useState } from "react";
import SterringButtons from "./SterringButtonsPlayer";
import TabButton from "./TabButton";
import AudioInformation from "./AudioInformation";

type AvailableTabs = "information" | "playlists" | "songs";

interface TabButtonsListMemo {
  tab: AvailableTabs;
  onChangeTabFn: () => void;
  activeTabState: [
    AvailableTabs,
    React.Dispatch<React.SetStateAction<AvailableTabs>>
  ];
}

let SONG_COUNT_TIMER: NodeJS.Timer | undefined;

export default function YTMusicPlayer() {
  const socket = useContext(SocketContext);
  const [activeTab, setActiveTab] = useState<AvailableTabs>("information");
  const [audioData, setAudioData] = useState<AudioYTDataInfo>({
    name: "",
    duration: 0,
    isPlaying: false,
    songsInQue: [],
    currentTime: 0,
    volume: 0,
  });

  useEffect(() => {
    const onGetAudioYTInfo = (cb: AudioYTDataInfo) => {
      setAudioData(cb);
      clearInterval(SONG_COUNT_TIMER);
      let currTime = cb.currentTime;
      SONG_COUNT_TIMER = setInterval(() => {
        currTime++;
        countSongTime(currTime, cb.duration);
      }, 1000);
    };

    const countSongTime = (time: number, duration: number) => {
      setAudioData((prevState) => ({ ...prevState, currentTime: time }));
      time++;
      if (time >= duration) {
        setAudioData((prevState) => ({ ...prevState, currentTime: 0 }));
      }
    };

    socket.on("getAudioYTInfo", (cb) => {
      onGetAudioYTInfo(cb);
    });

    socket.emit("getAudioYTInfo", (cb) => {
      onGetAudioYTInfo(cb);
    });

    socket.on("audioStop", () => {
      setAudioData((prevState) => ({ ...prevState, isPlaying: false }));
    });

    return () => {
      socket.off("audioStop");
      socket.off("getAudioYTInfo");
      clearInterval(SONG_COUNT_TIMER);
    };
  }, [socket]);

  const emitNextYoutubeSong = () => {
    socket.emit("musicYTNext");
  };

  const toggleYTPlayPause = () => {
    if (audioData.isPlaying) {
      socket.emit("musicYTPause");
    } else {
      socket.emit("musicYTPlay");
    }
    setAudioData((prevState) => ({
      ...prevState,
      isPlaying: !prevState.isPlaying,
    }));
  };

  const emitChangeYTVolume = (e: number) => {
    socket.emit("changeYTVolume", e);
  };

  const generateMusicPlayerContext = () => {
    switch (activeTab) {
      case "information":
        return (
          <AudioInformation<AudioYTDataInfo>
            audioData={audioData}
            setAudioData={setAudioData}
            onChangeVolumeFn={emitChangeYTVolume}
            eventsNames={{
              audioInfo: "getAudioYTInfo",
              audioStop: "musicYTStop",
            }}
          />
        );
      case "playlists":
        return <>Soon...playlists list</>;
      case "songs":
        return <>Soon...songs list</>;
    }
  };

  const TabButonsList = useMemo<TabButtonsListMemo[]>(() => {
    return [
      {
        tab: "information",
        onChangeTabFn: () => {},
        activeTabState: [activeTab, setActiveTab],
      },
      {
        tab: "playlists",
        onChangeTabFn: () => {},
        activeTabState: [activeTab, setActiveTab],
      },
      {
        tab: "songs",
        onChangeTabFn: () => {},
        activeTabState: [activeTab, setActiveTab],
      },
    ];
  }, [activeTab, setActiveTab]);

  return (
    <>
      <div>
        <SterringButtons
          playing={audioData.isPlaying}
          onNextSongFn={emitNextYoutubeSong}
          togglePlayPauseFn={toggleYTPlayPause}
        />
      </div>
      <div className="music-player-tabs-wrapper">
        {TabButonsList.map((item, index) => {
          return (
            <TabButton<AvailableTabs>
              key={index}
              tab={item.tab}
              activeTabState={[activeTab, setActiveTab]}
              onChangeTabFn={item.onChangeTabFn}
            />
          );
        })}
      </div>
      <div className="tab-containter">{generateMusicPlayerContext()}</div>
    </>
  );
}
