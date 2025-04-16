import Pagination from "@components/pagination";
import PreviousPage from "@components/previousPage";
import {
  useCreateMessageCategory,
  useGetMessageCategories,
  useEditMessageCategory,
  fetchMessageCategoriesDefaultParams,
} from "@services";
import Modal from "@components/modal";
import FilterBarCategories from "./filterBarCategories";
import { addNotification } from "@utils";
import CategoriesData from "./CategoriesData";
import CategoriesModalData from "./CategoriesModalData";
import { Error, Loading } from "@components/axiosHelper";
import {
  closeModal,
  resetMessageCategoryState,
  setEditingId,
} from "@redux/messageCategoriesSlice";
import { RootStore } from "@redux/store";
import { useDispatch, useSelector } from "react-redux";
import { useQueryParams } from "@hooks/useQueryParams";

export default function MessageCategoriesList() {
  const queryParams = useQueryParams(fetchMessageCategoriesDefaultParams);
  const {
    data: messageCategories,
    isLoading,
    error,
  } = useGetMessageCategories(queryParams);
  const dispatch = useDispatch();
  const {
    isModalOpen,
    messageCategory: messageCategoryState,
    editingId,
  } = useSelector((state: RootStore) => state.messageCategories);

  const createMessageCategoryMutation = useCreateMessageCategory();
  const updateMessageCategoryMutation = useEditMessageCategory();

  if (error) return <Error error={error} />;
  if (isLoading || !messageCategories) return <Loading />;

  const handleCreateMessageCategory = () => {
    createMessageCategoryMutation.mutate(messageCategoryState);
    dispatch(resetMessageCategoryState());
    dispatch(closeModal());
  };

  const handleUpdateMessageCategory = () => {
    if (!editingId) {
      addNotification(
        "Couldn't update message category",
        "No message category id",
        "warning"
      );
      return;
    }
    updateMessageCategoryMutation.mutate({
      id: editingId,
      updatedMessageCategory: messageCategoryState,
    });
    dispatch(resetMessageCategoryState());
    dispatch(closeModal());
    dispatch(setEditingId(""));
  };

  return (
    <>
      <PreviousPage />
      <FilterBarCategories />
      <CategoriesData data={messageCategories.data} />

      <div className="table-list-pagination">
        <Pagination
          className="pagination-bar"
          currentPage={messageCategories.currentPage}
          totalCount={messageCategories.count}
          localStorageName="messageCategoriesPageSize"
          siblingCount={1}
        />
      </div>
      <Modal
        title={`${editingId ? "Edit" : "Create"} message category`}
        onClose={() => dispatch(closeModal())}
        onSubmit={() => {
          editingId
            ? handleUpdateMessageCategory()
            : handleCreateMessageCategory();
        }}
        show={isModalOpen}
      >
        <CategoriesModalData />
      </Modal>
    </>
  );
}
