import React, { useContext, useEffect, useState } from "react";

import { SocketContext, AudioStreamDataInfo } from "@context/socket";
import { convertSecondsToMS } from "@utils/convertSecondsToMS";
import ProgressBar from "@ramonak/react-progress-bar";
export default function MusicPlayer() {
  const socket = useContext(SocketContext);
  const [songName, setSongName] = useState("");
  const [songDuration, setSongDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [audioData, setAudioData] = useState<AudioStreamDataInfo>();

  const showCurrentSongProgress = () => {
    const [maxMinutes, maxSeconds] = convertSecondsToMS(songDuration);
    const [currMinutes, currSeconds] = convertSecondsToMS(currentTime);

    return (
      <>
        <ProgressBar
          completed={currentTime}
          maxCompleted={songDuration}
          customLabel={` ${currMinutes}:${currSeconds} / ${maxMinutes}:${maxSeconds}`}
          labelAlignment="outside"
          labelSize="100%"
          width={"70%"}
          height="1rem"
          bgColor={"lightblue"}
        />
      </>
    );
  };
  useEffect(() => {
    let source: AudioBufferSourceNode | null = null;
    let gain: GainNode | null = null;
    let timer: NodeJS.Timer | undefined;
    let globalVolume: number | null;
    const musicStop = () => {
      clearInterval(timer);
      if (source) {
        source.stop();
      }
    };

    const countSongTime = (time: number, duration: number) => {
      setCurrentTime(time);
      time++;
      if (time >= duration) {
        setCurrentTime(0);
        clearInterval(timer);
      }
    };

    socket.on("audio", (data) => {
      setSongName(data.name);
      setSongDuration(data.duration);

      clearInterval(timer);
      let currTime = data.currentTime;
      timer = setInterval(() => {
        currTime++;
        countSongTime(currTime, data.duration);
      }, 1000);
      const audioCtx = new AudioContext();
      audioCtx.decodeAudioData(data.audioBuffer, (buffer) => {
        if (source) {
          source.stop();
        }
        if (gain) {
          gain.disconnect();
        }

        source = new AudioBufferSourceNode(audioCtx, {
          buffer: buffer,
        });

        gain = audioCtx.createGain();
        source.connect(gain);
        gain.connect(audioCtx.destination);
        gain.gain.value = globalVolume || 0.1;

        source.start(0, data.currentTime);
      });
    });

    socket.on("audioStop", () => musicStop());

    socket.on("changeVolume", (volume) => {
      if (!gain) return;
      let volumeToSet = volume;
      if (volume > 100) volumeToSet = 100;
      else if (volume < 0) volumeToSet = 0;

      gain.gain.value = volumeToSet / 100;

      globalVolume = volumeToSet / 100;
    });

    socket.emit("getAudioStreamData");
    const intervalContentId = setInterval(() => {
      setShowPlaylist((prevShow) => !prevShow);
    }, 20000);

    socket.on("getAudioInfo", (data) => {
      setAudioData(data);
    });
    socket.emit("getAudioInfo");

    return () => {
      socket.off("audio");
      socket.off("audioStop");
      socket.off("getAudioInfo");
      socket.off("changeVolume");

      clearInterval(intervalContentId);
      musicStop();
    };
  }, []);

  return (
    <div className="music-player-wrapper">
      {showPlaylist && audioData ? (
        <SongsPlaylist songs={audioData.songsInQue} />
      ) : (
        <>
          <div>
            <div className="music-player-song-name">{songName}</div>
          </div>
          <div className="music-player-song-duration">
            {showCurrentSongProgress()}
          </div>
        </>
      )}
    </div>
  );
}

function SongsPlaylist(props: { songs: [string, string][] }) {
  const { songs } = props;
  return (
    <div className="music-player-playlist prevent-select">
      <div className="music-player-playlist-songs">
        {songs.map((song, index) => {
          const [songName, requester] = song;
          return (
            <div key={index} className="music-player-playlist-song-wrapper">
              <div className="music-player-playlist-index">{index + 1}. </div>
              <div className="music-player-playlist-song-name">{songName} </div>
              <div className="music-player-playlist-requester">
                {requester || "default"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
