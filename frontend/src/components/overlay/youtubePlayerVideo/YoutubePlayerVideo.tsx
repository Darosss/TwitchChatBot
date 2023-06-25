import React, { useCallback, useContext, useEffect, useState } from "react";

import { SocketContext } from "@context/socket";
import YouTube, { YouTubeEvent, YouTubeProps } from "react-youtube";
import SongProgress from "../SongProgress";

let progressTimer: NodeJS.Timer; // as global because clear interval doesnt work
//FIXME: later

export default function MusicPlayer() {
  const socket = useContext(SocketContext);
  const [songName, setSongName] = useState("");
  const [player, setPlayer] = React.useState<YouTubeEvent | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);

  const handleYTPause = useCallback(() => {
    if (player) player.target.pauseVideo();
  }, [player]);

  const handleYTResume = useCallback(
    (name: string, time: number, volume: number) => {
      if (!player) return;

      player.target.loadVideoById(name, time);
      player.target.setVolume(volume);
    },
    [player]
  );

  const handleYTChangeVolume = useCallback(
    (volume: number) => {
      if (player) player.target.setVolume(volume);
    },
    [player]
  );

  useEffect(() => {
    socket.on("musicYTPause", handleYTPause);

    return () => {
      socket.off("musicYTPause", handleYTPause);
    };
  }, [handleYTPause, socket]);

  useEffect(() => {
    socket.on("audioYT", (data) => {
      setSongInterval();
      setCurrentTime(data.currentTime);
      setDuration(data.duration);
      handleYTResume(data.id, data.currentTime, data.volume);
      setSongName(data.name);
    });

    return () => {
      socket.off("audioYT");
    };
    //FIXME: later
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleYTResume, socket]);

  useEffect(() => {
    socket.on("changeYTVolume", (volume) => {
      handleYTChangeVolume(volume);
    });

    return () => {
      socket.off("changeYTVolume");
    };
  }, [handleYTChangeVolume, socket]);

  const countSongTime = () => setCurrentTime((prev) => prev + 1);

  const setSongInterval = () => {
    clearInterval(progressTimer);
    progressTimer = setInterval(() => {
      countSongTime();
    }, 1000);
  };

  useEffect(() => {
    return () => {
      clearInterval(progressTimer);
    };
    // Disable eslint - it just clearInterval
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPlayerReady: YouTubeProps["onReady"] = (event) => {
    setPlayer(event);

    socket.emit("getAudioYTData", (isPlaying, cb) => {
      setSongInterval();
      setCurrentTime(cb.currentTime);
      setDuration(cb.duration);

      if (!isPlaying) return;
      event.target.loadVideoById(cb.id, cb.currentTime);
      event.target.setVolume(cb.volume);
      setSongName(cb.name);
    });
  };
  const onPlayerEndSong: YouTubeProps["onEnd"] = (event) => {};

  const opts: YouTubeProps["opts"] = {
    height: "0%",
    width: "0%",
    playerVars: {
      autoplay: 0,
      enablejsapi: 1,
      modestbranding: 1,
    },
  };

  return (
    <div className={`youtube-player-wrapper ${songName ? "" : "hidden"}`}>
      <div className="youtube-song-details">
        <div className="youtube-current-song">{songName} </div>
        <div className="youtube-song-progress">
          <SongProgress songDuration={duration} currentTime={currentTime} />
        </div>
      </div>

      <div className="youtube-player">
        <YouTube opts={opts} onReady={onPlayerReady} onEnd={onPlayerEndSong} />
      </div>
    </div>
  );
}

// function SongsPlaylist(props: { songs: [string, string][] }) {
//   const { songs } = props;
//   return <div> Playlist</div>;
// }

//TODO: when widget is < 500 px show only name, <= 1000 show name + progress
