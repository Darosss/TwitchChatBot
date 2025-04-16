import ModalDataWrapper from "@components/modalDataWrapper";

import { useDispatch, useSelector } from "react-redux";
import { setName } from "@redux/tagsSlice";
import { RootStore } from "@redux/store";

export default function TagModalData() {
  const dispatch = useDispatch();
  const tagState = useSelector((state: RootStore) => state.tags.tag);
  const { name } = tagState;
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
