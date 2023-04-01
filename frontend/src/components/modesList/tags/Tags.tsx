import "./style.css";

import React, { useEffect, useState } from "react";
import Pagination from "@components/pagination";
import Modal from "@components/modal";
import PreviousPage from "@components/previousPage";
import {
  getTags,
  editTag,
  createTag,
  deleteTag,
  Tag,
} from "@services/TagService";
import { handleActionOnChangeState } from "@utils/handleDeleteApi";
import { addNotification } from "@utils/getNotificationValues";
import FilterBarModes from "../filterBarModes";

export default function Tags() {
  const [showModal, setShowModal] = useState(false);

  const [editingTag, setEditingTag] = useState("");
  const [tagIdDelete, setTagIdDelete] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [createName, setCreateName] = useState("");

  const { data: tagsData, loading, error, refetchData } = getTags();

  const { refetchData: fetchEditTag } = editTag(editingTag, { name: name });

  const { refetchData: fetchCreateTag } = createTag({
    name: createName,
  });

  const { refetchData: fetchDeleteTag } = deleteTag(
    tagIdDelete ? tagIdDelete : ""
  );

  useEffect(() => {
    handleActionOnChangeState(tagIdDelete, setTagIdDelete, () => {
      fetchDeleteTag()
        .then(() => {
          refetchData();
          addNotification("Deleted", "Tag deleted successfully", "danger");
          setTagIdDelete(null);
        })
        .catch((err) => {
          addNotification("Warning", err.response.data.message, "warning");
        });
    });
  }, [tagIdDelete]);

  if (error) return <>There is an error. {error.response?.data.message}</>;
  if (loading || !tagsData) return <> Loading...</>;

  const { data, count, currentPage } = tagsData;

  const createNewTag = () => {
    fetchCreateTag().then(() => {
      addNotification("Success", "Tag created successfully", "success");
      refetchData();
    });
  };

  const onSubmitEditModal = () => {
    fetchEditTag().then(() => {
      addNotification("Success", "Tag edited successfully", "success");
      refetchData();
    });
    resetOnChangeClasses();
    setShowModal(false);
  };

  const onCloseModal = () => {
    setShowModal(false);
    resetOnChangeClasses();
  };

  const changeColorOnChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    e.target.classList.add("changed-field");
  };

  const resetOnChangeClasses = () => {
    document.querySelectorAll(".changed-field").forEach((changed) => {
      changed.classList.remove("changed-field");
    });
  };

  const handleOnEdit = (tag: Tag) => {
    setEditingTag(tag._id);
    setName(tag.name);
    setShowModal(true);
  };

  return (
    <>
      <PreviousPage />
      <FilterBarModes />
      <div id="mode-list" className="table-list-wrapper mode-list-wrapper">
        <div>
          <div className="mode-list-create">
            <input
              type="text"
              placeholder="Name"
              value={createName}
              onChange={(e) => setCreateName(e.target.value)}
            ></input>
            <button
              onClick={createNewTag}
              className="common-button primary-button"
            >
              Create
            </button>
          </div>
        </div>
        {data.map((tag, index) => {
          return (
            <div key={index} className="mode-item">
              <button
                onClick={() => handleOnEdit(tag)}
                className="common-button primary-button edit-mode-button"
              >
                {tag.name}
              </button>
              <button
                onClick={() => setTagIdDelete(tag._id)}
                className="common-button danger-button remove-mode-btn"
              >
                X
              </button>
            </div>
          );
        })}
      </div>
      <div className="table-list-pagination">
        <Pagination
          className="pagination-bar"
          localStorageName="tagsListPageSize"
          currentPage={currentPage}
          totalCount={count}
          siblingCount={1}
        />
      </div>
      <Modal
        title="Edit tag"
        onClose={() => onCloseModal()}
        onSubmit={() => {
          onSubmitEditModal();
        }}
        show={showModal}
      >
        <div className="tags-list-modal-wrapper">
          <div>Name</div>
          <div>
            <input
              className="triggers-list-input"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                changeColorOnChange(e);
              }}
            />
          </div>
        </div>
      </Modal>
    </>
  );
}
