import ModalDataWrapper from "@components/modalDataWrapper";
import { generateSelectModes, useGetAllModes } from "@utils";
import { useDispatch, useSelector } from "react-redux";
import { RootStore } from "@redux/store";
import {
  setMessages,
  setMood,
  setName,
  setTag,
  toggleEnabled,
} from "@redux/messageCategoriesSlice";

export default function CategoriesModalData() {
  const modes = useGetAllModes();
  const dispatch = useDispatch();
  const messageCategoryState = useSelector(
    (state: RootStore) => state.messageCategories.messageCategory
  );
  const { tags, moods } = modes;
  return (
    <ModalDataWrapper>
      <div>Name</div>
      <div>
        <input
          className="categories-list-modal-input"
          type="text"
          value={messageCategoryState.name}
          onChange={(e) => dispatch(setName(e.target.value))}
        />
      </div>
      <div> Enabled </div>
      <div>
        <button
          onClick={() => dispatch(toggleEnabled())}
          className={`${
            !messageCategoryState.enabled ? "danger-button" : "primary-button"
          } common-button`}
        >
          {messageCategoryState.enabled.toString()}
        </button>
      </div>
      <div>Tag</div>
      <div>
        {generateSelectModes(
          messageCategoryState.tag,
          (e) => dispatch(setTag(e)),
          tags
        )}
      </div>
      <div>Mood</div>
      <div>
        {generateSelectModes(
          messageCategoryState.mood,
          (e) => dispatch(setMood(e)),
          moods
        )}
      </div>
      <div>Messages</div>
      <div>
        <textarea
          className="categories-list-textarea"
          value={messageCategoryState.messages?.join("\n")}
          onChange={(e) => dispatch(setMessages(e.target.value?.split("\n")))}
        />
      </div>
    </ModalDataWrapper>
  );
}
