import React from "react";
import { TimerCreateData } from "@services/TimerService";
import { AllModesReturn, generateSelectModes } from "@utils/getListModes";
import { DispatchAction } from "./types";
import ModalDataWrapper from "@components/modalDataWrapper";

interface TimerModalDataProps {
  state: TimerCreateData;
  dispatch: React.Dispatch<DispatchAction>;
  modes: AllModesReturn;
}

export default function TimerModalData({
  state,
  dispatch,
  modes: { tags, moods },
}: TimerModalDataProps) {
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
      <div>Non follow multi </div>
      <div>
        <button
          onClick={() => dispatch({ type: "SET_NON_FOLLOW_MULTI" })}
          className={
            `${!state.nonFollowMulti ? "danger-button" : "primary-button"} ` +
            "common-button "
          }
        >
          {state.nonFollowMulti.toString()}
        </button>
      </div>
      <div>Non sub multi </div>
      <div>
        <button
          onClick={() => dispatch({ type: "SET_NON_SUB_MULTI" })}
          className={
            `${!state.nonSubMulti ? "danger-button" : "primary-button"} ` +
            "common-button "
          }
        >
          {state.nonSubMulti.toString()}
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
      <div>Delay</div>
      <div>
        <input
          type="number"
          value={state.delay}
          onChange={(e) => {
            dispatch({ type: "SET_DELAY", payload: e.target.valueAsNumber });
          }}
        />
      </div>
      <div>Req points</div>
      <div>
        <input
          type="number"
          value={state.reqPoints}
          onChange={(e) => {
            dispatch({
              type: "SET_REQ_POINTS",
              payload: e.target.valueAsNumber,
            });
          }}
        />
      </div>
      <div>description </div>
      <div>
        <input
          value={state.description}
          onChange={(e) => {
            dispatch({
              type: "SET_DESC",
              payload: e.target.value,
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
