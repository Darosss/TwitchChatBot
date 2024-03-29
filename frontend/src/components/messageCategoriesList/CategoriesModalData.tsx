import React from "react";
import { AllModesReturn, generateSelectModes } from "@utils";
import { DispatchAction } from "./types";
import { MessageCategoryCreateData } from "@services";
import ModalDataWrapper from "@components/modalDataWrapper";

interface CategoriesModalDataProps {
  state: MessageCategoryCreateData;
  dispatch: React.Dispatch<DispatchAction>;
  modes: AllModesReturn;
}

export default function CategoriesModalData({
  state,
  dispatch,
  modes: { tags, moods },
}: CategoriesModalDataProps) {
  return (
    <ModalDataWrapper>
      <div>Name</div>
      <div>
        <input
          className="categories-list-modal-input"
          type="text"
          value={state.name}
          onChange={(e) => {
            dispatch({ type: "SET_NAME", payload: e.target.value });
          }}
        />
      </div>
      <div> Enabled </div>
      <div>
        <button
          onClick={() => dispatch({ type: "SET_ENABLED" })}
          className={
            `${!state.enabled ? "danger-button" : "primary-button"} ` +
            "common-button "
          }
        >
          {state.enabled.toString()}
        </button>
      </div>
      <div>Tag</div>
      <div>
        {generateSelectModes(
          state.tag,
          (e) => {
            dispatch({ type: "SET_TAG", payload: e });
          },
          tags
        )}
      </div>
      <div>Mood</div>
      <div>
        {generateSelectModes(
          state.mood,
          (e) => {
            dispatch({ type: "SET_MOOD", payload: e });
          },
          moods
        )}
      </div>
      <div>Messages</div>
      <div>
        <textarea
          className="categories-list-textarea"
          value={state.messages?.join("\n")}
          onChange={(e) => {
            dispatch({
              type: "SET_MESSAGES",
              payload: e.target.value?.split("\n"),
            });
          }}
        />
      </div>
    </ModalDataWrapper>
  );
}
