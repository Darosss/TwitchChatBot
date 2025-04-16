import { Error, Loading } from "@components/axiosHelper";
import CardboxWrapper from "@components/cardboxWrapper";
import Modal from "@components/modal";
import Pagination from "@components/pagination";
import PreviousPage from "@components/previousPage";
import {
  fetchTagsDefaultParams,
  useGetTags,
  useCreateTag,
  useEditTag,
} from "@services";
import { addNotification } from "@utils";
import { useDispatch, useSelector } from "react-redux";
import { useQueryParams } from "@hooks/useQueryParams";
import { RootStore } from "@redux/store";
import { resetTagState, closeModal, setEditingId } from "@redux/tagsSlice";
import FilterBarModes from "../filterBarModes";
import TagModalData from "./TagModalData";
import TagsData from "./TagsData";

export default function Tags() {
  const queryParams = useQueryParams(fetchTagsDefaultParams);
  const { data: tags, isLoading, error } = useGetTags(queryParams);
  const dispatch = useDispatch();
  const {
    isModalOpen,
    tag: tagState,
    editingId,
  } = useSelector((state: RootStore) => state.tags);

  const createTagMutation = useCreateTag();
  const updateTagMutation = useEditTag();

  if (error) return <Error error={error} />;
  if (isLoading || !tags) return <Loading />;

  const handleCreateTag = () => {
    createTagMutation.mutate(tagState);
    dispatch(resetTagState());
  };

  const handleUpdateTag = () => {
    if (!editingId) {
      addNotification("Couldn't update tag", "No tag id", "warning");
      return;
    }
    updateTagMutation.mutate({
      id: editingId,
      updatedTag: tagState,
    });
    dispatch(resetTagState());
    dispatch(setEditingId(""));
  };

  return (
    <>
      <PreviousPage />
      <FilterBarModes />
      <CardboxWrapper title={"Tags list"}>
        <TagsData data={tags.data} />
      </CardboxWrapper>
      <div className="table-list-pagination">
        <Pagination
          className="pagination-bar"
          localStorageName="tagsListPageSize"
          currentPage={tags.currentPage}
          totalCount={tags.count}
          siblingCount={1}
        />
      </div>
      <Modal
        title={`${editingId ? "Edit" : "Create"} tag`}
        onClose={() => dispatch(closeModal())}
        onSubmit={() => (editingId ? handleUpdateTag() : handleCreateTag())}
        show={isModalOpen}
      >
        <TagModalData />
      </Modal>
    </>
  );
}
