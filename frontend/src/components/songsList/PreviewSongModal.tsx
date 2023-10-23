import Modal from "@components/modal";
import { Song } from "@services";
import YouTube, { YouTubeProps } from "react-youtube";
import SongLikes from "./SongLikes";
import SongUsersUses from "./SongUsersUses";

interface PreviewSongModalProps {
  song: Song;
  onCloseModal: () => void;
}

export default function PreviewSongModal({
  song,
  onCloseModal,
}: PreviewSongModalProps) {
  const opts: YouTubeProps["opts"] = {
    width: window.innerWidth / 3,
    height: window.innerHeight / 3,
    playerVars: {
      autoplay: 1,
      enablejsapi: 1,
      modestbranding: 1,
    },
  };

  return (
    <Modal
      title={song.title}
      onClose={() => onCloseModal()}
      onSubmit={() => onCloseModal()}
      show={!!song}
    >
      <div className="preview-song-modal-content-wrapper">
        <YouTube opts={opts} videoId={song.youtubeId} />
        <div className="song-details">
          {song.customTitle ? (
            <div>
              <div>Custom title </div>
              <div> {song.customTitle.band + " " + song.customTitle.title}</div>
            </div>
          ) : null}
          <div>
            <div>Duration </div>
            <div>{song.duration}</div>
          </div>
          {Object.keys(song.likes).length > 0 ? (
            <div>
              <div>Likes </div>
              <div>
                <SongLikes likes={song.likes} />
              </div>
            </div>
          ) : null}
          {song.customId ? (
            <div>
              <div>Custom id </div>
              <div>{song.customId}</div>
            </div>
          ) : null}
          {song.usersUses ? (
            <div>
              <div>Users uses </div>
              <div>
                <SongUsersUses uses={song.usersUses} />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </Modal>
  );
}
