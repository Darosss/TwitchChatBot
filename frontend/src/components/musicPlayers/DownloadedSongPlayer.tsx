import { useCallback, useEffect } from "react";
import { AudioStreamDataEmitCb } from "@socketTypes";
import { useRef } from "react";
import { useSocketContext } from "@socket";

interface DownloadedSongPlayerProps {
  data: AudioStreamDataEmitCb;
}

export default function DownloadedSongPlayer({
  data,
}: DownloadedSongPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaSourceRef = useRef<MediaSource | null>(null);
  const sourceBufferRef = useRef<SourceBuffer | null>(null);
  const socket = useSocketContext();

  const getBufferedDuration = useCallback(() => {
    if (!sourceBufferRef.current) return;
    const buffered = sourceBufferRef.current.buffered;
    const currentTime = audioRef.current?.currentTime || 0;

    for (let i = 0; i < buffered.length; i++) {
      const start = buffered.start(i);
      const end = buffered.end(i);

      if (currentTime >= start && currentTime < end) {
        // This is the range that contains the current time
        const bufferedDuration = end - currentTime;

        return bufferedDuration;
      }
    }

    return 0;
  }, [sourceBufferRef, audioRef]);

  useEffect(() => {
    socket.events.audioChunk.on((data) => {
      if (sourceBufferRef.current && !sourceBufferRef.current.updating) {
        sourceBufferRef.current.appendBuffer(data.chunk as BufferSource);
      }
    });

    return () => {
      socket.events.audioChunk.off();
    };
  }, [socket]);

  useEffect(() => {
    const emitBufferedInfo = () => {
      const bufferedDuration = getBufferedDuration();

      socket.emits.sendBufferedInfo(bufferedDuration || 0);
    };

    const sendBufferedTimeInterval = setInterval(() => {
      if (!data.isPlaying || !audioRef.current) return;

      emitBufferedInfo();
    }, 1000);
    return () => {
      clearInterval(sendBufferedTimeInterval);
    };
  }, [data.isPlaying, audioRef, getBufferedDuration, socket]);

  const handleChangeVolume = useCallback(
    (volume: number) => {
      if (!audioRef.current) return;
      audioRef.current.volume = Number((volume / 100).toFixed(2));
    },
    [audioRef]
  );

  useEffect(() => {
    socket.events.changeVolume.on((volume) => {
      handleChangeVolume(volume);
    });

    return () => {
      socket.events.changeVolume.off();
    };
  }, [handleChangeVolume, socket]);

  useEffect(() => {
    if (sourceBufferRef.current) {
      sourceBufferRef.current.abort();
    }

    const mediaSource = new MediaSource();
    mediaSourceRef.current = mediaSource;

    if (audioRef.current) {
      audioRef.current.src = URL.createObjectURL(mediaSource);
    }

    mediaSource.addEventListener("sourceopen", () => {
      if (mediaSourceRef.current)
        sourceBufferRef.current =
          mediaSourceRef.current.addSourceBuffer("audio/mpeg");
    });

    return () => {
      if (sourceBufferRef.current) {
        sourceBufferRef.current.abort();
      }
    };
  }, [data.audioData.id]);

  return (
    <div>
      <audio ref={audioRef} autoPlay />
    </div>
  );
}
