import { CardboxItem } from "@components/cardboxWrapper/CardboxWrapper";
import { HandleShowModalParams } from "@components/types";
import {
  openModal,
  resetMoodState,
  setEditingId,
  setMoodState,
} from "@redux/moodsSlice";
import { Mood, useDeleteMood } from "@services";
import { useDispatch } from "react-redux";

interface MoodsDataProps {
  data: Mood[];
}

export default function MoodsData({ data }: MoodsDataProps) {
  const dispatch = useDispatch();
  const deleteMoodMutation = useDeleteMood();
  const handleDeleteMood = (id: string) => {
    if (
      !window.confirm(
        `Are you sure you want to delete the mood with ID: ${id}?`
      )
    )
      return;
    deleteMoodMutation.mutate(id);
  };

  const handleShowModal = (params: HandleShowModalParams<Mood>) => {
    dispatch(openModal());
    if (params?.type === "create") {
      dispatch(resetMoodState());

      return;
    }
    const { type, data } = params;
    if (type === "edit") dispatch(setEditingId(data._id));
    dispatch(setMoodState(data));
  };
  return (
    <>
      <CardboxItem title="Create mood">
        <button
          onClick={() => handleShowModal({ type: "create" })}
          className="common-button primary-button"
        >
          Create
        </button>
      </CardboxItem>
      {data.map((mood, index) => {
        return (
          <CardboxItem
            title={mood.name}
            onClickX={() => {
              handleDeleteMood(mood._id);
            }}
            key={index}
          >
            <button
              onClick={() => handleShowModal({ type: "edit", data: mood })}
              className="common-button primary-button edit-mode-button"
            >
              Edit
            </button>
          </CardboxItem>
        );
      })}
    </>
  );
}
