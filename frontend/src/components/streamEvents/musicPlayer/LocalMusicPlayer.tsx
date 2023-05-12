import React, { useEffect, useMemo } from "react";
import UploadMp3Form from "./UploadMp3Form";
import AudioFoldersList from "./AudioFoldersList";
import AudioFolderCreate from "./AudioFolderCreate";
import { SocketContext, AudioStreamDataInfo } from "@context/socket";
import { useContext, useState } from "react";
import SterringButtons from "./SterringButtonsPlayer";
import TabButton from "./TabButton";
import AudioInformation from "./AudioInformation";

type AvailableTabs = "information" | "upload" | "files" | "folders";

interface TabButtonsListMemo {
  tab: AvailableTabs;
  onChangeTabFn: () => void;
  activeTabState: [
    AvailableTabs,
    React.Dispatch<React.SetStateAction<AvailableTabs>>
  ];
}
let SONG_COUNT_TIMER: NodeJS.Timer | undefined;

export default function LocalMusicPlayer() {
  const socket = useContext(SocketContext);
  const [audioData, setAudioData] = useState<AudioStreamDataInfo>({
    name: "",
    duration: 0,
    isPlaying: false,
    songsInQue: [],
    currentTime: 0,
    currentFolder: "",
    volume: 0,
  });

  const [activeTab, setActiveTab] = useState<AvailableTabs>("information");

  useEffect(() => {
    const onGetAudioYTInfo = (cb: AudioStreamDataInfo) => {
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

    socket.on("getAudioInfo", (data) => {
      onGetAudioYTInfo(data);
    });

    socket.emit("getAudioInfo", (cb) => {
      onGetAudioYTInfo(cb);
    });

    socket.on("audioStop", () => {
      setAudioData((prevState) => ({ ...prevState, isPlaying: false }));
    });

    return () => {
      socket.off("getAudioInfo");
      socket.off("audioStop");
      clearInterval(SONG_COUNT_TIMER);
    };
  }, []);

  const toggleLocalPlayPause = () => {
    if (audioData.isPlaying) {
      socket.emit("musicPause");
      clearInterval(SONG_COUNT_TIMER);
    } else {
      socket.emit("musicPlay");
    }
    setAudioData((prevState) => ({
      ...prevState,
      isPlaying: !prevState.isPlaying,
    }));
  };

  const emitNextLocalSong = () => {
    socket.emit("musicNext");
  };

  const emitChangeLocalVolume = (e: number) => {
    socket.emit("changeVolume", e);
  };

  const generateMusicPlayerContext = () => {
    switch (activeTab) {
      case "information":
        return (
          <AudioInformation<AudioStreamDataInfo>
            audioData={audioData}
            setAudioData={setAudioData}
            onChangeVolumeFn={emitChangeLocalVolume}
          />
        );
      case "upload":
        return <UploadMp3Form />;
      case "files":
        return <AudioFoldersList />;
      case "folders":
        return <AudioFolderCreate />;
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
        tab: "upload",
        onChangeTabFn: () => {},
        activeTabState: [activeTab, setActiveTab],
      },
      {
        tab: "files",
        onChangeTabFn: () => {},
        activeTabState: [activeTab, setActiveTab],
      },
      {
        tab: "folders",
        onChangeTabFn: () => {},
        activeTabState: [activeTab, setActiveTab],
      },
    ];
  }, [activeTab, setActiveTab, socket]);

  return (
    <>
      <div>
        <SterringButtons
          playing={audioData.isPlaying}
          onNextSongFn={emitNextLocalSong}
          togglePlayPauseFn={toggleLocalPlayPause}
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
