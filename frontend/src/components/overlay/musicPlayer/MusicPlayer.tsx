import React, { useContext, useEffect, useState } from "react";

import { SocketContext } from "@context/SocketContext";
import { convertSecondsToMS } from "@utils/convertSecondsToMS";

export default function MusicPlayer() {
  const socket = useContext(SocketContext);
  const [songName, setSongName] = useState("");
  const [songDuration, setSongDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const showCurrentSongProgress = () => {
    const [maxMinutes, maxSeconds] = convertSecondsToMS(songDuration);
    const [currMinutes, currSeconds] = convertSecondsToMS(currentTime);

    return (
      <>
        {currMinutes}:{currSeconds} / {maxMinutes}:{maxSeconds}
      </>
    );
  };
  useEffect(() => {
    let source: AudioBufferSourceNode | null = null;
    let timer: NodeJS.Timer | undefined;

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
      console.log(currTime, "Piosenka teraz gra od ");
      timer = setInterval(() => {
        currTime++;
        countSongTime(currTime, data.duration);
      }, 1000);
      const audioCtx = new AudioContext();
      audioCtx.decodeAudioData(data.audioBuffer, (buffer) => {
        if (source) {
          console.log("SOURCE ALREADY IS SO STOP ");
          source.stop();
        }

        console.log("Create new source ");
        source = new AudioBufferSourceNode(audioCtx, {
          buffer: buffer,
        });

        const gainNode = audioCtx.createGain();
        source.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        gainNode.gain.value = 0.12;

        source.start(0, data.currentTime);
      });
    });

    socket.on("audioStop", () => musicStop());

    socket.emit("getAudioStreamData");

    return () => {
      socket.off("audio");
      socket.off("audioStop");
      musicStop();
    };
  }, []);

  return (
    <div className="music-player-wrapper">
      <div>
        Name:<span>{songName}</span>
      </div>
      <div>
        Duration:
        <span>{showCurrentSongProgress()}</span>
      </div>
    </div>
  );
}
