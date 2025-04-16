import { useState } from "react";

import "./yt-playlist.style.scss";
import { useSocketContext } from "@socket";

export default function YTPlaylist() {
  const socket = useSocketContext();
  const [playlist, setPlaylist] = useState("");

  const emitLoadSongs = () => {
    if (!playlist) return;
    socket.emits.loadPlaylist(playlist);
  };

  return (
    <div className="yt-playlist-list-wrapper">
      <button className="common-button primary-button" onClick={emitLoadSongs}>
        Load playlist
      </button>
      <input type="text" onChange={(e) => setPlaylist(e.target.value)} />
    </div>
  );
}
