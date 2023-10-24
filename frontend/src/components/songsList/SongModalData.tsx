import React from "react";
import { SongCreateData } from "@services";
import { DispatchAction } from "./types";
import ModalDataWrapper from "@components/modalDataWrapper/ModalDataWrapper";
import SearchUsers from "./SearchUsers";
interface SongModalDataProps {
  state: SongCreateData;
  dispatch: React.Dispatch<DispatchAction>;
}

export default function SongModalData({ state, dispatch }: SongModalDataProps) {
  return (
    <ModalDataWrapper>
      <div>Title</div>
      <div>
        <input
          type="text"
          value={state.title}
          onChange={(e) =>
            dispatch({ type: "SET_TITLE", payload: e.target.value })
          }
        />
      </div>
      <div>Youtube Id </div>
      <div>
        <input
          type="text"
          value={state.youtubeId}
          onChange={(e) =>
            dispatch({ type: "SET_YOUTUBE_ID", payload: e.target.value })
          }
        />
      </div>
      <div>Duration</div>
      <div>
        <input
          type="number"
          value={state.duration}
          onChange={(e) =>
            dispatch({ type: "SET_DURATION", payload: e.target.valueAsNumber })
          }
        />
      </div>
      <div>Custom title</div>
      <div>
        <input
          type="text"
          value={state.customTitle?.band || ""}
          placeholder="band"
          onChange={(e) =>
            dispatch({
              type: "SET_CUSTOM_TITLE",
              payload: {
                title: state.customTitle?.title || "",
                band: e.target.value,
              },
            })
          }
        />
        <input
          type="text"
          value={state.customTitle?.title || ""}
          placeholder="title"
          onChange={(e) =>
            dispatch({
              type: "SET_CUSTOM_TITLE",
              payload: {
                title: e.target.value,
                band: state.customTitle?.band || "",
              },
            })
          }
        />
      </div>
      <div>Custom id</div>
      <div>
        <input
          type="text"
          value={state.customId || ""}
          onChange={(e) =>
            dispatch({ type: "SET_CUSTOM_ID", payload: e.target.value })
          }
        />
      </div>
      <div>Who added</div>
      <div>
        <SearchUsers
          onClickUser={(user) =>
            dispatch({ type: "SET_WHO_ADDED", payload: user._id })
          }
        />
      </div>
    </ModalDataWrapper>
  );
}
