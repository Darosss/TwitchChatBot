import React, { useEffect, useState } from "react";

import {
  AudioStreamDataInfo,
  AudioStreamData,
  useSocketContext,
} from "@socket";
import SongProgress from "../SongProgress";

export default function MusicPlayer() {
  const socketContext = useSocketContext();
  const [songName, setSongName] = useState("");
  const [songDuration, setSongDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [audioData, setAudioData] = useState<AudioStreamDataInfo>();

  useEffect(() => {
    const { emits, events } = socketContext;
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

    const changeVolumeGain = (volume: number) => {
      if (!gain) return;
      let volumeToSet = volume;
      if (volume > 100) volumeToSet = 100;
      else if (volume < 0) volumeToSet = 0;

      gain.gain.value = volumeToSet / 100;

      globalVolume = volumeToSet / 100;
    };

    const onGetAudioSoundData = (data: AudioStreamData) => {
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
        changeVolumeGain(data.volume);

        gain.gain.value = globalVolume || 0.1;

        source.start(0, data.currentTime);
      });
    };

    events.audio.on((data) => {
      onGetAudioSoundData(data);
    });

    events.audioStop.on(() => musicStop());

    events.changeVolume.on((volume) => {
      changeVolumeGain(volume);
    });

    const intervalContentId = setInterval(() => {
      setShowPlaylist((prevShow) => !prevShow);
    }, 20000);

    events.getAudioInfo.on((data) => {
      setAudioData(data);
    });

    emits.getAudioInfo((cb) => {
      setAudioData(cb);
    });

    emits.getAudioStreamData((isPlaying, cb) => {
      if (!isPlaying) return;

      onGetAudioSoundData(cb);
    });

    return () => {
      events.audio.off();
      events.audioStop.off();
      events.getAudioInfo.off();
      events.changeVolume.off();

      clearInterval(intervalContentId);
      musicStop();
    };
  }, [socketContext]);

  return (
    <div className={`music-player-wrapper ${songName ? "" : "hidden"}`}>
      {showPlaylist && audioData ? (
        <SongsPlaylist songs={audioData.songsInQue} />
      ) : (
        <>
          <div>
            <div className="music-player-song-name">{songName}</div>
          </div>
          <div className="music-player-song-duration">
            <SongProgress
              songDuration={songDuration}
              currentTime={currentTime}
            />
          </div>
        </>
      )}
    </div>
  );
}

interface SongsPlaylistProps {
  songs: AudioStreamDataInfo["songsInQue"];
}

function SongsPlaylist({ songs }: SongsPlaylistProps) {
  return (
    <div className="music-player-playlist prevent-select">
      <div className="music-player-playlist-songs">
        {songs.map(([songName, requester], index) => (
          <div key={index} className="music-player-playlist-song-wrapper">
            <div className="music-player-playlist-index">{index + 1}. </div>
            <div className="music-player-playlist-song-name">{songName} </div>
            <div className="music-player-playlist-requester">
              {requester?.username || "default"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
