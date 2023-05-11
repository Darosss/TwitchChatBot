import React, { useContext, useEffect } from "react";
import {
  SocketContext,
  AudioStreamDataInfo,
  AudioYTDataInfo,
} from "@context/socket";
import { convertSecondsToMS } from "@utils/convertSecondsToMS";

interface AudioInformationProps<
  T extends AudioYTDataInfo | AudioStreamDataInfo
> {
  audioData: T;
  setAudioData: React.Dispatch<React.SetStateAction<T>>;
  changeVolumeEmit: ChangeVolumeEmitNames;
}

type ChangeVolumeEmitNames = "changeVolume" | "changeYTVolume";

export default function AudioInformation<
  T extends AudioYTDataInfo | AudioStreamDataInfo
>(props: AudioInformationProps<T>) {
  const socket = useContext(SocketContext);
  const { audioData, setAudioData, changeVolumeEmit } = props;

  useEffect(() => {
    socket.on(changeVolumeEmit, (volume) => {
      volume;
    });
  }, []);

  const emitChangeLocalVolume = (e: number) => {
    socket.emit(changeVolumeEmit, e);
  };

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
            onMouseUp={(e) =>
              emitChangeLocalVolume(e.currentTarget.valueAsNumber)
            }
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
