import React from "react";
import { convertSecondsToMS } from "@utils";
import { AudioStreamData, AudioStreamDataEmitCb } from "@socketTypes";
import { useTimer } from "@hooks/useTimer";

interface AudioInformationProps {
  isPlaying: boolean;
  audioServerData: AudioStreamDataEmitCb;
  setAudioData: React.Dispatch<React.SetStateAction<AudioStreamData>>;
  changeVolumeFn: (volume: number) => void;
}

export default function AudioInformation(props: AudioInformationProps) {
  const {
    isPlaying,
    audioServerData: { audioData, songsInQue },
    setAudioData,
    changeVolumeFn,
  } = props;
  const timer = useTimer({
    currentTime: audioData.currentTime,
    duration: audioData.duration,
    isPlaying,
  });

  const showCurrentSongProgress = () => {
    const [maxMinutes, maxSeconds] = convertSecondsToMS(
      audioData?.duration || 0
    );

    const [currMinutes, currSeconds] = convertSecondsToMS(timer);

    return `${currMinutes}:${currSeconds} / ${maxMinutes}:${maxSeconds}`;
  };

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
            onMouseUp={(e) => changeVolumeFn(e.currentTarget.valueAsNumber)}
          />
          {audioData.volume}
        </div>
        {audioData.downloadedData ? (
          <div>Folder: {audioData.downloadedData.folderName} </div>
        ) : null}
        <div>{audioData.name}</div>
        <div> {showCurrentSongProgress()} </div>
        <div className="audio-playlist-wrapper">
          {[...songsInQue].map((song, index) => {
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
