import React, { useContext, useEffect, useState } from "react";
import {
  SocketContext,
  AudioStreamDataInfo,
  AudioYTDataInfo,
} from "@context/socket";
import { convertSecondsToMS } from "@utils/convertSecondsToMS";

interface AudioInformationProps {
  audioData: AudioStreamDataInfo | AudioYTDataInfo;
  changeVolumeEmit: ChangeVolumeEmitNames;
}

type ChangeVolumeEmitNames = "changeVolume" | "changeYTVolume";

export default function AudioInformation(props: AudioInformationProps) {
  const socket = useContext(SocketContext);
  const { audioData, changeVolumeEmit } = props;
  const [volume, setVolume] = useState<number>(20);

  useEffect(() => {
    socket.on(changeVolumeEmit, (volume) => {
      setVolume(volume);
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
            value={volume}
            onChange={(e) => setVolume(e.target.valueAsNumber)}
            onMouseUp={(e) =>
              emitChangeLocalVolume(e.currentTarget.valueAsNumber)
            }
          />
          {volume}
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
