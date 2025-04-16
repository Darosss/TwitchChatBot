import { useSocketContext } from "@socket";
import { AudioStreamData, AudioStreamDataEmitCb } from "@socketTypes";
import { useCallback, useEffect, useState } from "react";

const useMusicPlayer = () => {
  const socket = useSocketContext();
  const [audioData, setAudioData] = useState<AudioStreamData>({
    name: "",
    duration: 0,
    currentTime: 0,
    volume: 0,
    id: "",
    type: "local",
  });
  const [songsInQue, setSongsInQue] = useState<
    AudioStreamDataEmitCb["songsInQue"]
  >([]);
  const [isPlaying, setIsPlaying] =
    useState<AudioStreamDataEmitCb["isPlaying"]>(false);

  const emitPause = useCallback(() => {
    socket.emits.musicPause();
    setIsPlaying(false);
  }, [socket]);

  const emitStop = useCallback(() => {
    socket.emits.musicStop();
  }, [socket]);

  const emitPlay = useCallback(() => {
    socket.emits.musicPlay();
  }, [socket]);

  const emitNext = useCallback(() => {
    socket.emits.musicNext();
  }, [socket]);

  const emitChangeVolume = useCallback(
    (volume: number) => {
      const correctedVolume = volume < 0 ? 0 : volume > 100 ? 100 : volume;

      socket.emits.changeVolume(correctedVolume);
    },
    [socket]
  );

  useEffect(() => {
    socket.emits.getAudioData(({ audioData, isPlaying, songsInQue }) => {
      setAudioData(audioData);
      setIsPlaying(isPlaying);
      setSongsInQue(songsInQue);
    });
    socket.events.audioStreamData.on(({ audioData, isPlaying, songsInQue }) => {
      setAudioData(audioData);
      setIsPlaying(isPlaying);
      setSongsInQue(songsInQue);
    });

    socket.events.musicPause.on((playing) => {
      setAudioData({
        currentTime: 0,
        id: "",
        name: "",
        duration: 0,
        volume: 0,
        type: "local",
      });
      setIsPlaying(playing);
    });

    return () => {
      socket.events.audioStreamData.off();
      socket.events.musicPause.off();
    };
  }, [socket]);

  return {
    audioData,
    isPlaying,
    songsInQue,
    setAudioData,
    emitPause,
    emitStop,
    emitPlay,
    emitNext,
    emitChangeVolume,
  };
};

export default useMusicPlayer;
