import Modal from "@components/modal";
import { Song } from "@services";
import YouTube, { YouTubeProps } from "react-youtube";

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

  console.log(song.likes);

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
        </div>
      </div>
    </Modal>
  );
}

interface SongLikesProps {
  likes: Record<string, number>;
}

function SongLikes({ likes }: SongLikesProps) {
  return (
    <>
      {/* {Object.entries(likes).map(([id, like], index) => (
        <div key={index}>
          <div>{id}</div>
          <div>{like}</div>
        </div>
      ))} */}
    </>
  );
}

// TODO: add song likes
// TODO: add song uses users?
