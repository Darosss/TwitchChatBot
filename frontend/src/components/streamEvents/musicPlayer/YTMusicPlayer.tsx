import React, { useCallback, useEffect, useMemo } from "react";
import { AudioYTDataInfo, useSocketContext } from "@context";
import { useState } from "react";
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
  const socketContext = useSocketContext();
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
    const {
      emits: { getAudioYTInfo: emitGetAudioYTInfo },
      events: { getAudioYTInfo, audioStop },
    } = socketContext;
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

    getAudioYTInfo.on((cb) => {
      onGetAudioYTInfo(cb);
    });

    emitGetAudioYTInfo((cb) => {
      onGetAudioYTInfo(cb);
    });

    audioStop.on(() => {
      setAudioData((prevState) => ({ ...prevState, isPlaying: false }));
    });

    return () => {
      audioStop.off();
      getAudioYTInfo.off();
      clearInterval(SONG_COUNT_TIMER);
    };
  }, [socketContext]);

  const toggleYTPlayPause = useCallback(() => {
    const {
      emits: { musicYTPause, musicYTPlay },
    } = socketContext;
    if (audioData.isPlaying) {
      musicYTPlay();
    } else {
      musicYTPause();
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
          emits: { changeYTVolume },
        } = socketContext;
        return (
          <AudioInformation<AudioYTDataInfo>
            audioData={audioData}
            setAudioData={setAudioData}
            onChangeVolumeFn={(volume) => changeYTVolume(volume)}
            youtubePlayer={true}
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
          onNextSongFn={() => socketContext.emits.musicYTNext()}
          togglePlayPauseFn={toggleYTPlayPause}
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
