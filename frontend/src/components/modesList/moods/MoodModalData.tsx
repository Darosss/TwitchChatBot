import ModalDataWrapper from "@components/modalDataWrapper";
import { useDispatch, useSelector } from "react-redux";
import { setName } from "@redux/moodsSlice";
import { RootStore } from "@redux/store";

export default function MoodModalData() {
  const dispatch = useDispatch();
  const moodState = useSelector((state: RootStore) => state.moods.mood);
  const { name } = moodState;
  return (
    <ModalDataWrapper>
      <div>Name</div>
      <div>
        <input
          type="text"
          value={name}
          onChange={(e) => {
            dispatch(setName(e.currentTarget.value));
          }}
        />
      </div>
    </ModalDataWrapper>
  );
}
