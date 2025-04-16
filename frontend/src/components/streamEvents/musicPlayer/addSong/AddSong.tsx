import Modal from "@components/modal";
import { useCallback, useState } from "react";
import "./style.scss";
import { useSocketContext } from "@socket";

export function AddSong() {
  const socket = useSocketContext();
  const [songData, setSongData] = useState("");

  const handleOnAddSong = useCallback(() => {
    if (!songData) return;
    socket.emits.addSongToPlayer(songData);
  }, [socket, songData]);

  const [showModal, setShowModal] = useState(false);
  return (
    <div>
      <div className="music-player-tabs-wrapper">
        <button
          className={`common-button switch-players-button`}
          onClick={() => setShowModal(true)}
        >
          Add song
        </button>
      </div>
      <Modal
        title={"Add song"}
        onClose={() => setShowModal(false)}
        onSubmit={() => setShowModal(false)}
        show={showModal}
      >
        <div className="add-song-modal-content">
          <input
            type="text"
            value={songData}
            onChange={(e) => setSongData(e.currentTarget.value)}
          />

          <button
            className="common-button primary-button"
            onClick={handleOnAddSong}
          >
            Add to player
          </button>
        </div>
      </Modal>
    </div>
  );
}
