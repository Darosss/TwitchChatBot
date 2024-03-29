import React from "react";
import { AllModesReturn, generateSelectModes } from "@utils";
import { DispatchAction } from "./types";
import ModalDataWrapper from "@components/modalDataWrapper/ModalDataWrapper";
import { ChatCommandCreateData } from "@services";

interface CommandModalDataProps {
  state: ChatCommandCreateData;
  dispatch: React.Dispatch<DispatchAction>;
  modes: AllModesReturn;
}

export default function CommandModalData({
  state,
  dispatch,
  modes: { tags, moods },
}: CommandModalDataProps) {
  return (
    <ModalDataWrapper>
      <div>Name </div>
      <div>
        <input
          type="text"
          value={state.name}
          onChange={(e) =>
            dispatch({ type: "SET_NAME", payload: e.target.value })
          }
        />
      </div>

      <div> Enabled </div>
      <div>
        <button
          onClick={() => dispatch({ type: "SET_ENABLED" })}
          className={`${
            !state.enabled ? "danger-button" : "primary-button"
          } common-button`}
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
      <div>Privilege</div>
      <div>
        <input
          type="number"
          value={state.privilege}
          onChange={(e) =>
            dispatch({
              type: "SET_PRIVILEGE",
              payload: e.target.valueAsNumber,
            })
          }
        />
      </div>

      <div>Description </div>
      <div>
        <textarea
          value={state.description}
          onChange={(e) =>
            dispatch({
              type: "SET_DESC",
              payload: e.target.value,
            })
          }
        />
      </div>

      <div>Aliases </div>
      <div>
        <textarea
          value={state.aliases?.join("\n")}
          onChange={(e) =>
            dispatch({
              type: "SET_ALIASES",
              payload: e.target.value?.split("\n"),
            })
          }
        />
      </div>

      <div>Messages </div>
      <div>
        <textarea
          value={state.messages?.join("\n")}
          onChange={(e) =>
            dispatch({
              type: "SET_MESSAGES",
              payload: e.target.value?.split("\n"),
            })
          }
        />
      </div>
    </ModalDataWrapper>
  );
}
