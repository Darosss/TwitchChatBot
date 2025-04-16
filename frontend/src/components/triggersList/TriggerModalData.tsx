import { useDispatch, useSelector } from "react-redux";

import ModalDataWrapper from "@components/modalDataWrapper";
import { TriggerMode } from "@services";
import { useGetAllModes, generateSelectModes } from "@utils";
import { setEnabled } from "@redux/songsSlice";
import { RootStore } from "@redux/store";
import {
  setChance,
  setDelay,
  setMessages,
  setMode,
  setMood,
  setName,
  setTag,
  setWords,
} from "@redux/triggersSlice";

export default function TriggerModalData() {
  const modes = useGetAllModes();
  const { tags, moods } = modes;

  const dispatch = useDispatch();
  const triggerState = useSelector(
    (state: RootStore) => state.triggers.trigger
  );

  return (
    <ModalDataWrapper>
      <div>Name</div>
      <div>
        <input
          type="text"
          value={triggerState.name}
          onChange={(e) => dispatch(setName(e.currentTarget.value))}
        />
      </div>
      <div> Enabled </div>
      <div>
        <button
          onClick={() => dispatch(setEnabled(!triggerState.enabled))}
          className={`common-button ${
            triggerState.enabled ? "primary-button" : "danger-button"
          } `}
        >
          {triggerState.enabled.toString()}
        </button>
      </div>
      <div>Chance </div>
      <div>
        <input
          type="number"
          value={triggerState.chance}
          onChange={(e) => dispatch(setChance(e.currentTarget.valueAsNumber))}
        />
      </div>
      <div>Mode </div>
      <div>
        <select
          value={triggerState.mode}
          onChange={(e) =>
            dispatch(setMode(e.currentTarget.value as TriggerMode))
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
          triggerState.tag,
          (e) => dispatch(setTag(e)),
          tags
        )}
      </div>
      <div>Mood</div>
      <div>
        {generateSelectModes(
          triggerState.mood,
          (e) => dispatch(setMood(e)),

          moods
        )}
      </div>

      <div>Delay</div>
      <div>
        <input
          type="number"
          value={triggerState.delay}
          onChange={(e) => dispatch(setDelay(e.currentTarget.valueAsNumber))}
        />
      </div>
      <div>Words</div>
      <div>
        <textarea
          value={triggerState.words?.join("\n")}
          onChange={(e) =>
            dispatch(setWords(e.currentTarget.value?.split("\n") || []))
          }
        />
      </div>
      <div>Messages</div>
      <div>
        <textarea
          value={triggerState.messages?.join("\n")}
          onChange={(e) =>
            dispatch(setMessages(e.currentTarget.value?.split("\n") || []))
          }
        />
      </div>
    </ModalDataWrapper>
  );
}
