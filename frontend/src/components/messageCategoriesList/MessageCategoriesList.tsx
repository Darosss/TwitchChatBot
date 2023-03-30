import "./style.css";
import React, { useEffect, useReducer, useState } from "react";

import Pagination from "@components/pagination";
import PreviousPage from "@components/previousPage";

import {
  createMessageCategory,
  deleteMessageCategoryById,
  editMessageCategoryById,
  getMessageCategories,
  MessageCategory,
  MessageCategoryCreateData,
} from "@services/MessageCategoriesService";
import Modal from "@components/modal";
import FilterBarCategories from "./filterBarCategories";
import { addNotification } from "@utils/getNotificationValues";
import { getAllModes } from "@utils/getListModes";
import { DispatchAction } from "./types";
import { handleDeleteLayout } from "@utils/handleDeleteApi";
import CategoriesData from "./CategoriesData";
import CategoriesModalData from "./CategoriesModalData";

export default function MessageCategoriesList() {
  const [showModal, setShowModal] = useState(false);

  const [editingCategory, setEditingCategory] = useState("");
  const [categoryIdDelete, setCategoryIdDelete] = useState<string | null>(null);

  const [state, dispatch] = useReducer(reducer, initialState);

  const modes = getAllModes();

  const {
    data: categoriesData,
    loading,
    error,
    refetchData,
  } = getMessageCategories();

  const { refetchData: fetchEditCategory } = editMessageCategoryById(
    editingCategory,
    state
  );
  const { refetchData: fetchCreateCategory } = createMessageCategory(state);
  const { refetchData: fetchDeleteCategory } = deleteMessageCategoryById(
    categoryIdDelete || ""
  );

  useEffect(() => {
    handleDeleteLayout<MessageCategory>(
      categoryIdDelete,
      setCategoryIdDelete,
      () => {
        fetchDeleteCategory().then(() => {
          refetchData();
          addNotification(
            "Deleted",
            "Message category deleted successfully",
            "danger"
          );
          setCategoryIdDelete(null);
        });
      }
    );
  }, [categoryIdDelete]);

  if (error) return <>There is an error. {error.response?.data.message}</>;
  if (!categoriesData || loading || !modes) return <>Loading!</>;

  const { data, currentPage, count } = categoriesData;

  const onSubmitModalCreate = () => {
    fetchCreateCategory().then(() => {
      addNotification(
        "Success",
        "Message category created successfully",
        "success"
      );
      refetchData();
      setShowModal(false);
    });
  };

  const onSubmitModalEdit = () => {
    fetchEditCategory().then(() => {
      addNotification(
        "Success",
        "Message category edited successfully",
        "success"
      );
      refetchData();
      handleOnHideModal();
    });
  };

  const setState = (category: MessageCategory) => {
    dispatch({
      type: "SET_STATE",
      payload: {
        name: category.name,
        messages: category.messages,
        enabled: category.enabled,
        mood: category.mood._id,
        personality: category.personality._id,
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
        setCategoryIdToDelete={setCategoryIdDelete}
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
  personality: "",
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
    case "SET_PERSONALITY":
      return { ...state, personality: action.payload };
    case "SET_MOOD":
      return { ...state, mood: action.payload };
    case "SET_STATE":
      return { ...state, ...action.payload };
    default:
      throw new Error("Invalid action type");
  }
}
