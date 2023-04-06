import React, { useContext, useEffect, useMemo, useRef, useState } from "react";

import { SocketContext } from "@context/SocketContext";

export default function MusicPlayer() {
  const socket = useContext(SocketContext);
  const [songName, setSongName] = useState("");
  const [songDuration, setSongDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  // Memoize the AudioContext instance

  const remainingTime = (currentTime: string) => {};

  useEffect(() => {
    let source: AudioBufferSourceNode | null = null;
    let timer: NodeJS.Timer | undefined;

    const musicStop = () => {
      clearInterval(timer);
      if (source) {
        source.stop();
      }
    };

    socket.on("audio", (data) => {
      setSongName(data.name);
      setSongDuration(data.duration);

      clearInterval(timer);
      let currTime = data.currentTime;
      console.log(currTime, "Piosenka teraz gra od ");
      timer = setInterval(() => {
        setCurrentTime(currTime);
        currTime++;
        if (currTime >= data.duration) {
          setCurrentTime(0);
          clearInterval(timer);
        }
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
        // const source = new AudioBufferSourceNode(memoizedAudioCtx, {
        //   buffer: buffer,
        // });

        // const gainNode = memoizedAudioCtx?.createGain();
        // source.connect(gainNode);
        // gainNode.connect(memoizedAudioCtx?.destination);

        // gainNode.gain.value = 0.02;

        // source.start(0, data.currentTime);
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
        Name: <span>{songName}</span>
      </div>
      <div>
        Duration:
        <span>
          {" " + currentTime} / {Math.round(songDuration)} sec
        </span>
      </div>
    </div>
  );
}
