import "./style.css";
import React, { useEffect, useState } from "react";

import Pagination from "@components/pagination";
import PreviousPage from "@components/previousPage";

import { PaginationData } from "@services/ApiService";
import {
  createMessageCategory,
  deleteMessageCategoryById,
  editMessageCategoryById,
  getMessageCategories,
  MessageCategory,
} from "@services/MessageCategoriesService";
import Modal from "@components/modal";
import FilterBarCategories from "./filterBarCategories";
import { addNotification } from "@utils/getNotificationValues";

interface MessageCategoryDetailsProp {
  categories: MessageCategory[];
  refetchData: () => Promise<PaginationData<MessageCategory>>;
}

export default function MessageCategoriesList() {
  const { data, loading, error, refetchData } = getMessageCategories();
  if (error) return <>There is an error. {error.response?.data.message}</>;
  if (!data || loading) return <>Loading!</>;

  const { data: categoriesData, currentPage, count } = data;
  return (
    <>
      <PreviousPage />
      <FilterBarCategories />
      <div id="message-categories-list" className="table-list-wrapper">
        <MessageCategoriesDetails
          categories={categoriesData}
          refetchData={refetchData}
        />
      </div>
      <div className="table-list-pagination">
        <Pagination
          className="pagination-bar"
          currentPage={currentPage}
          totalCount={count}
          localStorageName="messageCategoriesPageSize"
          siblingCount={1}
        />
      </div>
    </>
  );
}

const MessageCategoriesDetails = ({
  categories,
  refetchData,
}: MessageCategoryDetailsProp) => {
  const [showModal, setShowModal] = useState(false);

  const [editingCategory, setEditingCategory] = useState("");
  const [categoryIdToDelete, setCategoryIdToDelete] = useState<string | null>(
    null
  );
  const [category, setCategory] = useState("");
  const [messages, setMessages] = useState([""]);

  const { refetchData: fetchEditCategory } = editMessageCategoryById(
    editingCategory,
    {
      category: category,
      messages: messages,
    }
  );

  const { refetchData: fetchCreateCategory } = createMessageCategory({
    category: `new category ${new Date().getTime().toString()}`,
    messages: ["example message 1"],
  });

  const { refetchData: fetchDeleteCategory } = deleteMessageCategoryById(
    categoryIdToDelete ? categoryIdToDelete : ""
  );

  useEffect(() => {
    if (
      categoryIdToDelete !== null &&
      confirm(`Are you sure you want to delete command: ${categoryIdToDelete}?`)
    ) {
      fetchDeleteCategory().then(() => {
        // socketRefreshMessageCategories();
        refetchData();
        addNotification(
          "Deleted",
          "Message category deleted successfully",
          "danger"
        );
        setCategoryIdToDelete(null);
      });
    } else {
      setCategoryIdToDelete(null);
    }
  }, [categoryIdToDelete]);

  const handleOnClickEditButton = (category: MessageCategory) => {
    const { _id, category: catName, messages } = category;
    setEditingCategory(_id);
    setCategory(catName);
    setMessages(messages);

    setShowModal(true);
  };

  const onCloseModal = () => {
    setShowModal(false);
  };

  const onSubmitEditModal = () => {
    fetchEditCategory().then(() => {
      // socketRefreshMessageCategories();
      addNotification(
        "Success",
        "Message category edited successfully",
        "success"
      );
      refetchData();
    });
    setShowModal(false);
  };

  const createNewCategory = () => {
    fetchCreateCategory().then(() => {
      // socketRefreshMessageCategories();
      addNotification(
        "Success",
        "Message category created successfully",
        "success"
      );
      refetchData();
    });
  };

  return (
    <>
      <table id="table-message-categories-list">
        <thead>
          <tr>
            <th>Category</th>
            <th>
              Actions
              <button
                className="common-button primary-button"
                onClick={(e) => createNewCategory()}
              >
                New
              </button>
            </th>
            <th>Uses</th>
            <th>Messages</th>
          </tr>
        </thead>

        <tbody>
          {categories.map((category, index) => {
            return (
              <tr key={index}>
                <td className="message-category-name">{category.category}</td>
                <td className="message-category-edit">
                  <button
                    className="common-button primary-button"
                    onClick={() => {
                      handleOnClickEditButton(category);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="common-button danger-button"
                    onClick={() => setCategoryIdToDelete(category._id)}
                  >
                    Delete
                  </button>
                </td>
                <td className="message-category-uses ">{category.uses}</td>

                <td className="message-category-messages">
                  <div className="message-category-messages-wrapper">
                    {category.messages.map((message, index) => {
                      return <div key={index}>{message}</div>;
                    })}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Modal
        title="Edit message category"
        onClose={() => onCloseModal()}
        onSubmit={() => {
          onSubmitEditModal();
        }}
        show={showModal}
      >
        <div className="message-categories-edit-modal">
          <div>
            <div className="message-categories-modal-header">Category</div>
            <div>
              <input
                className="message-categories-input"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                }}
              />
            </div>
          </div>
          <div>
            <div className="message-categories-modal-header">Messages</div>
            <div>
              <textarea
                className="message-categories-textarea"
                value={messages?.join("\n")}
                onChange={(e) => {
                  setMessages(e.target.value?.split("\n"));
                }}
              />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};
