import React, { useEffect } from "react";
import {
  AudioStreamDataInfo,
  AudioYTDataInfo,
  useSocketContext,
} from "@context";
import { convertSecondsToMS } from "@utils";

interface AudioInformationProps<
  T extends AudioYTDataInfo | AudioStreamDataInfo
> {
  audioData: T;
  setAudioData: React.Dispatch<React.SetStateAction<T>>;
  onChangeVolumeFn: (volume: number) => void;
  youtubePlayer?: boolean;
}

export default function AudioInformation<
  T extends AudioYTDataInfo | AudioStreamDataInfo
>({
  audioData,
  setAudioData,
  onChangeVolumeFn,
  youtubePlayer,
}: AudioInformationProps<T>) {
  const socketContext = useSocketContext();

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
    console.log("AUDIO INFORMATION HOW MUCH RENDER");
    let SONG_COUNT_TIMER: NodeJS.Timer | undefined;
    const {
      events: { audioStop, getAudioInfo, getAudioYTInfo },
    } = socketContext;

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

    //getAudioYTInfo
    //musicYTStop
    if (youtubePlayer) {
      getAudioYTInfo.on((data) => {
        onGetAudioYTInfo(data as T);
      });
    } else {
      getAudioInfo.on((data) => {
        onGetAudioYTInfo(data as T);
      });
    }

    // as i know there is only audioStop for both local / yt
    audioStop.on(() => {
      setAudioData((prevState) => ({ ...prevState, isPlaying: false }));
    });

    return () => {
      if (youtubePlayer) getAudioYTInfo.off();
      else getAudioInfo.off();

      audioStop.off();
      clearInterval(SONG_COUNT_TIMER);
    };
  }, [setAudioData, socketContext, youtubePlayer]);

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
          {[...audioData.songsInQue].map(([songName, requester], index) => (
            <div key={index} className="audio-playlist-audio-list">
              <div>{songName}</div>
              <div>{`${requester ? `${requester.username}` : `default`}`}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
