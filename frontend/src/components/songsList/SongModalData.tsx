import ModalDataWrapper from "@components/modalDataWrapper/ModalDataWrapper";
import SearchUsers from "./SearchUsers";
import { useDispatch, useSelector } from "react-redux";
import { RootStore } from "@redux/store";
import {
  setTitle,
  setYoutubeId,
  setSunoId,
  setDuration,
  setEnabled,
  setCustomTitle,
  setCustomId,
  setWhoAdded,
} from "@redux/songsSlice";

export default function SongModalData() {
  const dispatch = useDispatch();
  const songState = useSelector((state: RootStore) => state.songs.song);
  return (
    <ModalDataWrapper>
      <div>Title</div>
      <div>
        <input
          type="text"
          value={songState.title}
          onChange={(e) => dispatch(setTitle(e.currentTarget.value))}
        />
      </div>
      <div>Youtube Id </div>
      <div>
        <input
          type="text"
          value={songState.youtubeId}
          onChange={(e) => dispatch(setYoutubeId(e.currentTarget.value))}
        />
      </div>
      <div>Suno Id </div>
      <div>
        <input
          type="text"
          value={songState.sunoId}
          onChange={(e) => dispatch(setSunoId(e.currentTarget.value))}
        />
      </div>
      <div>Duration</div>
      <div>
        <input
          type="number"
          value={songState.duration}
          onChange={(e) => dispatch(setDuration(e.currentTarget.valueAsNumber))}
        />
      </div>
      <div>Enabled</div>
      <div>
        <button
          className={`common-button ${
            songState.enabled ? "primary-button" : "danger-button"
          }`}
          onClick={() => dispatch(setEnabled(!songState.enabled))}
        >
          {songState.enabled ? "TRUE" : "FALSE"}
        </button>
      </div>
      <div>Custom title</div>
      <div>
        <input
          type="text"
          value={songState.customTitle?.band || ""}
          placeholder="band"
          onChange={(e) =>
            dispatch(
              setCustomTitle({
                title: songState.customTitle?.title || "",
                band: e.target.value,
              })
            )
          }
        />
        <input
          type="text"
          value={songState.customTitle?.title || ""}
          placeholder="title"
          onChange={(e) =>
            dispatch(
              setCustomTitle({
                title: e.target.value,
                band: songState.customTitle?.band || "",
              })
            )
          }
        />
      </div>
      <div>Custom id</div>
      <div>
        <input
          type="text"
          value={songState.customId || ""}
          onChange={(e) => dispatch(setCustomId(e.currentTarget.value))}
        />
      </div>
      <div>Who added</div>
      <div>
        <SearchUsers
          currentUserId={songState.whoAdded}
          onClickUser={(user) => dispatch(setWhoAdded(user._id))}
        />
      </div>
    </ModalDataWrapper>
  );
}
