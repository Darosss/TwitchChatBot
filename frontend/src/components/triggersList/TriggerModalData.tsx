import React from "react";
import { TriggerCreateData, TriggerMode } from "@services/TriggerService";
import { AllModesReturn, generateSelectModes } from "@utils/getListModes";
import { DispatchAction } from "./types";
import ModalDataWrapper from "@components/modalDataWrapper/ModalDataWrapper";

export default function TriggerModalData(props: {
  state: TriggerCreateData;
  dispatch: React.Dispatch<DispatchAction>;
  modes: AllModesReturn;
}) {
  const { state, dispatch, modes } = props;
  const { tags, personalities, moods } = modes;
  return (
    <ModalDataWrapper>
      <div>Name</div>
      <div>
        <input
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
      <div>Chance </div>
      <div>
        <input
          type="number"
          value={state.chance}
          onChange={(e) => {
            dispatch({
              type: "SET_CHANCE",
              payload: e.target.valueAsNumber,
            });
          }}
        />
      </div>
      <div>Mode </div>
      <div>
        <select
          value={state.mode}
          onChange={(e) =>
            dispatch({
              type: "SET_MODE",
              payload: e.target.value as TriggerMode,
            })
          }
        >
          {(["ALL", "STARTS-WITH", "WHOLE-WORD"] as TriggerMode[]).map(
            (modeTrigger, index) => {
              return (
                <option key={index} value={modeTrigger}>
                  {modeTrigger}
                </option>
              );
            }
          )}
        </select>
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
      <div>Personality</div>
      <div>
        {generateSelectModes(
          state.personality,
          (e) => {
            dispatch({ type: "SET_PERSONALITY", payload: e });
          },
          personalities
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

      <div>Delay</div>
      <div>
        <input
          type="number"
          value={state.delay}
          onChange={(e) => {
            dispatch({
              type: "SET_DELAY",
              payload: e.target.valueAsNumber,
            });
          }}
        />
      </div>
      <div>Words</div>
      <div>
        <textarea
          value={state.words?.join("\n")}
          onChange={(e) => {
            dispatch({
              type: "SET_WORDS",
              payload: e.target.value?.split("\n"),
            });
          }}
        />
      </div>
      <div>Messages</div>
      <div>
        <textarea
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
