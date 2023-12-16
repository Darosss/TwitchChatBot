import React, { useState } from "react";
import Pagination from "@components/pagination";
import Modal from "@components/modal";
import PreviousPage from "@components/previousPage";
import {
  useGetTags,
  useEditTag,
  useCreateTag,
  useDeleteTag,
  Tag,
} from "@services";
import { addSuccessNotification } from "@utils";
import FilterBarModes from "../filterBarModes";
import ModalDataWrapper from "@components/modalDataWrapper";
import { AxiosError, Loading } from "@components/axiosHelper";
import { useAxiosWithConfirmation } from "@hooks";

export default function Tags() {
  const [showModal, setShowModal] = useState(false);

  const [editingTag, setEditingTag] = useState("");

  const [name, setName] = useState("");
  const [createName, setCreateName] = useState("");

  const { data: tagsData, loading, error, refetchData } = useGetTags();

  const { refetchData: fetchEditTag } = useEditTag(editingTag, { name: name });

  const { refetchData: fetchCreateTag } = useCreateTag({
    name: createName,
  });

  const setTagIdToDelete = useAxiosWithConfirmation({
    hookToProceed: useDeleteTag,
    opts: { onFullfiled: () => refetchData() },
  });

  if (error) return <AxiosError error={error} />;
  if (loading || !tagsData) return <Loading />;

  const { data, count, currentPage } = tagsData;

  const createNewTag = () => {
    fetchCreateTag().then(() => {
      addSuccessNotification("Tag created successfully");
      refetchData();
    });
  };

  const onSubmitEditModal = () => {
    fetchEditTag().then(() => {
      addSuccessNotification("Tag edited successfully");
      refetchData();
    });
    setShowModal(false);
  };

  const onCloseModal = () => {
    setShowModal(false);
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
      <div className="table-list-wrapper mode-list-wrapper">
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
        {data.map((tag, index) => (
          <div key={index} className="mode-item">
            <button
              onClick={() => handleOnEdit(tag)}
              className="common-button primary-button edit-mode-button"
            >
              {tag.name}
            </button>
            <button
              onClick={() => setTagIdToDelete(tag._id)}
              className="common-button danger-button remove-mode-btn"
            >
              X
            </button>
          </div>
        ))}
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
        <ModalDataWrapper>
          <div>Name</div>
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </div>
        </ModalDataWrapper>
      </Modal>
    </>
  );
}
