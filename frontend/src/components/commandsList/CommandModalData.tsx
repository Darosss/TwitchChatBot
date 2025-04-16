import ModalDataWrapper from "@components/modalDataWrapper/ModalDataWrapper";
import { useGetAllModes, generateSelectModes } from "@utils";
import { useDispatch, useSelector } from "react-redux";
import {
  setName,
  setEnabled,
  setTag,
  setMood,
  setPrivilege,
  setDescription,
  setAliases,
  setMessages,
} from "@redux/commandsSlice";
import { RootStore } from "@redux/store";

export default function CommandModalData() {
  const dispatch = useDispatch();
  const commandState = useSelector(
    (state: RootStore) => state.commands.command
  );
  const modes = useGetAllModes();
  const { tags, moods } = modes;
  return (
    <ModalDataWrapper>
      <div>Name </div>
      <div>
        <input
          type="text"
          value={commandState.name}
          onChange={(e) => dispatch(setName(e.currentTarget.value))}
        />
      </div>

      <div> Enabled </div>
      <div>
        <button
          onClick={() => dispatch(setEnabled(!commandState.enabled))}
          className={`${
            commandState.enabled ? "primary-button" : "danger-button"
          } common-button`}
        >
          {commandState.enabled.toString()}
        </button>
      </div>
      <div>Tag</div>
      <div>
        {generateSelectModes(
          commandState.tag,
          (e) => {
            dispatch(setTag(e));
          },
          tags
        )}
      </div>
      <div>Mood</div>
      <div>
        {generateSelectModes(
          commandState.mood,
          (e) => {
            dispatch(setMood(e));
          },
          moods
        )}
      </div>
      <div>Privilege</div>
      <div>
        <input
          type="number"
          value={commandState.privilege}
          onChange={(e) =>
            dispatch(setPrivilege(e.currentTarget.valueAsNumber))
          }
        />
      </div>

      <div>Description </div>
      <div>
        <textarea
          value={commandState.description}
          onChange={(e) => dispatch(setDescription(e.currentTarget.value))}
        />
      </div>

      <div>Aliases </div>
      <div>
        <textarea
          value={commandState.aliases?.join("\n")}
          onChange={(e) =>
            dispatch(setAliases(e.currentTarget.value?.split("\n") || []))
          }
        />
      </div>

      <div>Messages </div>
      <div>
        <textarea
          value={commandState.messages?.join("\n")}
          onChange={(e) =>
            dispatch(setMessages(e.currentTarget.value?.split("\n") || []))
          }
        />
      </div>
    </ModalDataWrapper>
  );
}
