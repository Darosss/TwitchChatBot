import { useEffect, useState } from "react";
import moment from "moment";
import { useSelector } from "react-redux";
import { useSocketContext } from "@socket";
import { RootStore } from "@redux/store";
import SongProgress from "../songProgress";
import useMusicPlayer from "@hooks/useMusicPlayer";
import { RequestSongData } from "@socketTypes";
import { DownloadedSongPlayer, YoutubePlayer } from "@components/musicPlayers";

export default function MusicPlayer() {
  const overlaysStateRedux = useSelector((state: RootStore) => state.overlays);
  const {
    isEditor,
    baseData: {
      styles: { overlayMusicPlayer: styles },
    },
  } = overlaysStateRedux;

  const { audioData, isPlaying, songsInQue, setAudioData } = useMusicPlayer();

  useEffect(() => {
    if (!isEditor || audioData.id) return;

    setAudioData({
      id: "djV11Xbc914",
      name: "a-ha - Take On Me",
      duration: 240,
      currentTime: 100,
      volume: 25,
      type: "yt",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioData.id, isEditor]);

  return (
    <div
      className={`music-player-wrapper ${isPlaying ? "" : "hidden"}`}
      style={{ borderRadius: styles.borderRadius }}
    >
      <div
        className="music-player-background"
        style={{
          background: styles.background,
          filter: `opacity(${styles.opacity}%)`,
          boxShadow: styles.boxShadow,
        }}
      ></div>
      <div className="music-song-details">
        <div className="song-site">{audioData.type}</div>
        <div
          className="music-current-song"
          style={{
            fontSize: styles.currentSong.fontSize,
            color: styles.currentSong.color,
          }}
        >
          {audioData.name}{" "}
          {audioData.requester ? (
            <>
              <span className="music-song-requester-name">
                {"->  "}
                {audioData.requester}
              </span>{" "}
            </>
          ) : null}
        </div>
        <div className="music-song-progress">
          <SongProgress
            songDuration={audioData.duration || 0}
            currentTime={audioData.currentTime}
            progressBarProps={{
              labelColor: styles.progressBar.color,
              labelSize: styles.progressBar.fontSize,
              bgColor: styles.progressBar.background,
              baseBgColor: styles.progressBar.baseBackground,
            }}
          />
        </div>
      </div>

      <div className="music-player">
        {audioData.type === "yt" ? (
          <YoutubePlayer isPlaying={isPlaying} songId={audioData.id} />
        ) : audioData.downloadedData ? (
          <DownloadedSongPlayer
            data={{
              audioData,
              isPlaying,
              songsInQue,
            }}
          />
        ) : null}
      </div>
      <RequestedSongsAnimation />
    </div>
  );
}

//TODO: when widget is < 500 px show only name, <= 1000 show name + progress

function RequestedSongsAnimation() {
  const {
    isEditor,
    baseData: {
      styles: {
        overlayMusicPlayer: { requests: styles },
      },
    },
  } = useSelector((state: RootStore) => state.overlays);

  const [requestedSongs, setRequestedSongs] = useState<RequestSongData[]>([]);

  const socket = useSocketContext();

  function addRequestedSong(songName: string, username: string) {
    setRequestedSongs((prevState) => [{ songName, username }, ...prevState]);
  }

  function removeLastFromRequestedSongs() {
    setRequestedSongs((prevState) => {
      prevState.pop();
      return [...prevState];
    });
  }
  useEffect(() => {
    if (!isEditor) return;

    setInterval(() => {
      setRequestedSongs((prevState) => [
        {
          songName: `Random song ${moment.now()}`,
          username: `random username ${moment.now()}`,
        },
        ...prevState,
      ]);
    }, 2500);
  }, [isEditor]);

  useEffect(() => {
    if (requestedSongs.length > 0) {
      setTimeout(() => {
        removeLastFromRequestedSongs();
      }, 20000);
    }
  }, [requestedSongs]);

  useEffect(() => {
    socket?.events?.requestSong.on((data) => {
      addRequestedSong(data.songName, data.username);
    });

    return () => {
      socket?.events?.requestSong.off();
    };
  }, [socket]);
  return requestedSongs.length > 0 ? (
    <div
      className="request-wrapper"
      style={{
        boxShadow: styles.boxShadow,
        color: styles.color,
        background: styles.background,
      }}
    >
      <div
        className="request-wrapper-header"
        style={{
          fontSize: styles.headerFontSize,
        }}
      >
        Requests
      </div>
      <div className="request-notifications-wrapper">
        {requestedSongs.map(({ username, songName }, idx) => {
          return (
            <div
              key={username + songName + Math.random()} // add this for trigger animation with same index it doesnt work
            >
              <div
                style={{
                  fontSize: styles.fontSize,
                }}
              >
                <div>
                  <span
                    style={{
                      color: styles.nicknameColor,
                    }}
                  >
                    {username}
                  </span>
                  <span style={{ color: styles.color }}> requested:</span>
                </div>
                <div>{songName}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  ) : null;
}
