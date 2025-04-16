import { CardboxItem } from "@components/cardboxWrapper/CardboxWrapper";
import { HandleShowModalParams } from "@components/types";
import {
  openModal,
  resetTagState,
  setEditingId,
  setTagState,
} from "@redux/tagsSlice";
import { Tag, useDeleteTag } from "@services";
import { useDispatch } from "react-redux";

interface TagsDataProps {
  data: Tag[];
}

export default function TagsData({ data }: TagsDataProps) {
  const dispatch = useDispatch();
  const deleteTagMutation = useDeleteTag();
  const handleDeleteTag = (id: string) => {
    if (
      !window.confirm(`Are you sure you want to delete the tag with ID: ${id}?`)
    )
      return;
    deleteTagMutation.mutate(id);
  };
  const handleShowModal = (params: HandleShowModalParams<Tag>) => {
    dispatch(openModal());
    if (params?.type === "create") {
      dispatch(resetTagState());

      return;
    }
    const { type, data } = params;
    if (type === "edit") dispatch(setEditingId(data._id));
    dispatch(setTagState(data));
  };
  return (
    <>
      <CardboxItem title="Create tag">
        <button
          onClick={() => handleShowModal({ type: "create" })}
          className="common-button primary-button"
        >
          Create
        </button>
      </CardboxItem>
      {data.map((tag, index) => {
        return (
          <CardboxItem
            title={tag.name}
            onClickX={() => {
              handleDeleteTag(tag._id);
            }}
            key={index}
          >
            <button
              onClick={() => handleShowModal({ type: "edit", data: tag })}
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
