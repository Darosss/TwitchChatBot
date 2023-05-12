import React, { useCallback, useContext, useEffect, useState } from "react";

import { SocketContext } from "@context/socket";
import YouTube, { YouTubeEvent, YouTubeProps } from "react-youtube";
export default function MusicPlayer() {
  const socket = useContext(SocketContext);
  const [songName, setSongName] = useState("");
  const [player, setPlayer] = React.useState<YouTubeEvent | null>(null);

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
  }, [handleYTPause]);

  useEffect(() => {
    socket.on("audioYT", (data) => {
      handleYTResume(data.id, data.currentTime, data.volume);
      setSongName(data.name);
    });

    return () => {
      socket.off("audioYT");
    };
  }, [handleYTResume]);

  useEffect(() => {
    socket.on("changeYTVolume", (volume) => {
      handleYTChangeVolume(volume);
    });

    return () => {
      socket.off("changeYTVolume");
    };
  }, [handleYTChangeVolume]);

  const onPlayerReady: YouTubeProps["onReady"] = (event) => {
    setPlayer(event);

    socket.emit("getAudioYTData", (isPlaying, cb) => {
      if (!isPlaying) return;
      event.target.loadVideoById(cb.id, cb.currentTime);
      event.target.setVolume(cb.volume);
      setSongName(cb.name);
    });
  };
  const onPlayerEndSong: YouTubeProps["onEnd"] = (event) => {};
  const opts: YouTubeProps["opts"] = {
    height: "100%",
    width: "100%",
    playerVars: {
      autoplay: 0,
      enablejsapi: 1,
      modestbranding: 1,
    },
  };

  return (
    <div className="youtube-player-wrapper">
      <div className="youtube-song-details">
        <div className="youtube-current-song">{songName} </div>
        <div className="youtube-song-progress">progress soon </div>
      </div>

      <div className="youtube-player">
        <YouTube opts={opts} onReady={onPlayerReady} onEnd={onPlayerEndSong} />
      </div>
    </div>
  );
}

function SongsPlaylist(props: { songs: [string, string][] }) {
  const { songs } = props;
  return <div> Playlist</div>;
}

//TODO: when widget is < 500 px show only name, <= 1000 show name + progress
