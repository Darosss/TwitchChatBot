import React, { useCallback, useMemo } from "react";
import UploadMp3Form from "./UploadMp3Form";
import AudioFoldersList from "./AudioFoldersList";
import AudioFolderCreate from "./AudioFolderCreate";
import { AudioStreamDataInfo, useSocketContext } from "@socket";
import { useState } from "react";
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

export default function LocalMusicPlayer() {
  const socketContext = useSocketContext();
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

  const toggleLocalPlayPause = useCallback(() => {
    const {
      emits: { musicPause, musicPlay },
    } = socketContext;
    if (audioData.isPlaying) {
      musicPause();
    } else {
      musicPlay();
    }
    setAudioData((prevState) => ({
      ...prevState,
      isPlaying: !prevState.isPlaying,
    }));
  }, [socketContext, audioData]);

  const generateMusicPlayerContext = () => {
    switch (activeTab) {
      case "information":
        const {
          emits: { changeVolume },
        } = socketContext;
        return (
          <AudioInformation<AudioStreamDataInfo>
            audioData={audioData}
            setAudioData={setAudioData}
            onChangeVolumeFn={(volume) => changeVolume(volume)}
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
  }, [activeTab, setActiveTab]);

  return (
    <>
      <div>
        <SterringButtons
          playing={audioData.isPlaying}
          onNextSongFn={() => socketContext.emits.musicNext()}
          togglePlayPauseFn={toggleLocalPlayPause}
        />
      </div>
      <div className="music-player-tabs-wrapper">
        {TabButonsList.map((item, index) => (
          <TabButton<AvailableTabs>
            key={index}
            tab={item.tab}
            activeTabState={[activeTab, setActiveTab]}
            onChangeTabFn={item.onChangeTabFn}
          />
        ))}
      </div>
      <div className="tab-containter">{generateMusicPlayerContext()}</div>
    </>
  );
}
