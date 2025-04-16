import { useSocketContext } from "@socket";
import { useCallback, useEffect, useRef } from "react";
import { viteBackendUrl } from "@configs/envVariables";

interface YoutubePlayerProps {
  songId: string;
  isPlaying: boolean;
}

export default function YoutubePlayer({
  songId,
  isPlaying,
}: YoutubePlayerProps) {
  const socket = useSocketContext();
  const audioPlayer = useRef<any>();

  const handleYTChangeVolume = useCallback(
    (volume: number) => {
      if (!audioPlayer || !audioPlayer.current) return;
      audioPlayer.current.volume = volume / 100;
    },
    [audioPlayer]
  );
  useEffect(() => {
    socket.events.changeVolume.on((volume) => {
      handleYTChangeVolume(volume);
    });

    return () => {
      socket.events.changeVolume.off();
    };
  }, [handleYTChangeVolume, socket]);

  return isPlaying ? (
    <audio
      src={`${viteBackendUrl}/public/music/youtube/${songId}.mp3`}
      autoPlay
    />
  ) : null;
}
