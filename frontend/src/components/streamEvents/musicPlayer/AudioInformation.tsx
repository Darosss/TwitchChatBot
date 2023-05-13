import React, { useContext, useEffect } from "react";
import {
  SocketContext,
  AudioStreamDataInfo,
  AudioYTDataInfo,
} from "@context/socket";
import { convertSecondsToMS } from "@utils/convertSecondsToMS";

type EventNamesAudioInfo = "getAudioInfo" | "getAudioYTInfo";
type EventNamesAudioStop = "audioStop" | "musicYTStop";

interface AudioInformationProps<
  T extends AudioYTDataInfo | AudioStreamDataInfo
> {
  audioData: T;
  setAudioData: React.Dispatch<React.SetStateAction<T>>;
  onChangeVolumeFn: (volume: number) => void;
  eventsNames: {
    audioInfo: EventNamesAudioInfo;
    audioStop: EventNamesAudioStop;
  };
}

export default function AudioInformation<
  T extends AudioYTDataInfo | AudioStreamDataInfo
>(props: AudioInformationProps<T>) {
  const socket = useContext(SocketContext);
  const { audioData, setAudioData, onChangeVolumeFn, eventsNames } = props;

  const { audioInfo, audioStop } = eventsNames;

  const showCurrentSongProgress = () => {
    const [maxMinutes, maxSeconds] = convertSecondsToMS(
      audioData?.duration || 0
    );
    const [currMinutes, currSeconds] = convertSecondsToMS(
      audioData.currentTime
    );

    return (
      <>
        {currMinutes}:{currSeconds} / {maxMinutes}:{maxSeconds}
      </>
    );
  };
  useEffect(() => {
    let SONG_COUNT_TIMER: NodeJS.Timer | undefined;

    const countSongTime = (time: number, duration: number) => {
      setAudioData((prevState) => ({ ...prevState, currentTime: time }));
      time++;
      if (time >= duration) {
        setAudioData((prevState) => ({ ...prevState, currentTime: 0 }));
      }
    };
    const onGetAudioYTInfo = (cb: T) => {
      if (!cb.isPlaying) return;
      setAudioData(cb);
      clearInterval(SONG_COUNT_TIMER);

      let currTime = cb.currentTime;
      SONG_COUNT_TIMER = setInterval(() => {
        currTime++;
        countSongTime(currTime, cb.duration);
      }, 1000);
    };

    socket.on(audioInfo, (data: any) => {
      onGetAudioYTInfo(data as T);
    });

    socket.emit(audioInfo, (cb: any) => {
      onGetAudioYTInfo(cb as T);
    });

    socket.on(audioStop, () => {
      setAudioData((prevState) => ({ ...prevState, isPlaying: false }));
    });

    return () => {
      socket.off(audioInfo);
      socket.off(audioStop);
      clearInterval(SONG_COUNT_TIMER);
    };
  }, [audioInfo, audioStop, setAudioData, socket]);

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
            value={audioData.volume}
            onChange={(e) =>
              setAudioData((prevState) => ({
                ...prevState,
                volume: e.target.valueAsNumber,
              }))
            }
            onMouseUp={(e) => onChangeVolumeFn(e.currentTarget.valueAsNumber)}
          />
          {audioData.volume}
        </div>
        {audioData && "currentFolder" in audioData ? (
          <div>Current folder: {audioData.currentFolder}</div>
        ) : null}
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
}
