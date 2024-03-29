import React, { useReducer, useState } from "react";

import Pagination from "@components/pagination";
import PreviousPage from "@components/previousPage";

import {
  useCreateMessageCategory,
  useDeleteMessageCategoryById,
  useEditMessageCategoryById,
  useGetMessageCategories,
  MessageCategory,
  MessageCategoryCreateData,
} from "@services";
import Modal from "@components/modal";
import FilterBarCategories from "./filterBarCategories";
import { addSuccessNotification, useGetAllModes } from "@utils";
import { DispatchAction } from "./types";
import CategoriesData from "./CategoriesData";
import CategoriesModalData from "./CategoriesModalData";
import { AxiosError, Loading } from "@components/axiosHelper";
import { useAxiosWithConfirmation } from "@hooks";

export default function MessageCategoriesList() {
  const [showModal, setShowModal] = useState(false);

  const [editingCategory, setEditingCategory] = useState("");

  const [state, dispatch] = useReducer(reducer, initialState);

  const modes = useGetAllModes();

  const {
    data: categoriesData,
    loading,
    error,
    refetchData,
  } = useGetMessageCategories();

  const { refetchData: fetchEditCategory } = useEditMessageCategoryById(
    editingCategory,
    state
  );
  const { refetchData: fetchCreateCategory } = useCreateMessageCategory(state);

  const setCategoryIdToDelete = useAxiosWithConfirmation({
    hookToProceed: useDeleteMessageCategoryById,
    opts: { onFullfiled: () => refetchData() },
  });

  if (error) return <AxiosError error={error} />;
  if (!categoriesData || loading || !modes) return <Loading />;

  const { data, currentPage, count } = categoriesData;

  const onSubmitModalCreate = () => {
    fetchCreateCategory().then(() => {
      addSuccessNotification("Message category created successfully");
      refetchData();
      setShowModal(false);
    });
  };

  const onSubmitModalEdit = () => {
    fetchEditCategory().then(() => {
      addSuccessNotification("Message category edited successfully");
      refetchData();
      handleOnHideModal();
    });
  };

  const setState = (category: MessageCategory) => {
    dispatch({
      type: "SET_STATE",
      payload: {
        name: category.name,
        messages: category.messages.map((msg) => msg[0]),
        enabled: category.enabled,
        mood: category.mood._id,
        tag: category.tag._id,
      },
    });
  };

  const handleOnShowEditModal = (category: MessageCategory) => {
    setEditingCategory(category._id);
    setState(category);
    setShowModal(true);
  };

  const handleOnShowCreateModal = (category?: MessageCategory) => {
    if (category) {
      setState(category);
    } else {
      dispatch({ type: "SET_STATE", payload: initialState });
    }

    setShowModal(true);
  };

  const handleOnHideModal = () => {
    setShowModal(false);
    setEditingCategory("");
  };
  return (
    <>
      <PreviousPage />
      <FilterBarCategories />
      <CategoriesData
        data={data}
        handleOnShowCreateModal={handleOnShowCreateModal}
        handleOnShowEditModal={handleOnShowEditModal}
        setCategoryIdToDelete={setCategoryIdToDelete}
      />

      <div className="table-list-pagination">
        <Pagination
          className="pagination-bar"
          currentPage={currentPage}
          totalCount={count}
          localStorageName="messageCategoriesPageSize"
          siblingCount={1}
        />
      </div>
      <Modal
        title={`${editingCategory ? "Edit" : "Create"} message category`}
        onClose={handleOnHideModal}
        onSubmit={() => {
          editingCategory ? onSubmitModalEdit() : onSubmitModalCreate();
        }}
        show={showModal}
      >
        <CategoriesModalData state={state} dispatch={dispatch} modes={modes} />
      </Modal>
    </>
  );
}

const initialState: MessageCategoryCreateData = {
  name: "",
  enabled: true,
  messages: [""],
  tag: "",
  mood: "",
};
function reducer(
  state: MessageCategoryCreateData,
  action: DispatchAction
): MessageCategoryCreateData {
  switch (action.type) {
    case "SET_NAME":
      return { ...state, name: action.payload };
    case "SET_ENABLED":
      return { ...state, enabled: action.payload || !state.enabled };
    // case "SET_DESC":
    //   return { ...state, description: action.payload };
    case "SET_MESSAGES":
      return { ...state, messages: action.payload };
    case "SET_TAG":
      return { ...state, tag: action.payload };

    case "SET_MOOD":
      return { ...state, mood: action.payload };
    case "SET_STATE":
      return { ...state, ...action.payload };
    default:
      throw new Error("Invalid action type");
  }
}
