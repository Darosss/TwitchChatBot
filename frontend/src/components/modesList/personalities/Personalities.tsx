import "./style.css";

import React, { useEffect, useState } from "react";
import Pagination from "@components/pagination";
import Modal from "@components/modal";
import PreviousPage from "@components/previousPage";
import {
  getPersonalities,
  editPersonality,
  createPersonality,
  deletePersonality,
  Personality,
} from "@services/PersonalityService";
import { handleDeleteLayout } from "@utils/handleDeleteApi";
import { addNotification } from "@utils/getNotificationValues";
import FilterBarModes from "../filterBarModes";

export default function Personalities() {
  const [showModal, setShowModal] = useState(false);

  const [editingPersonality, setEditingPersonality] = useState("");
  const [personalityIdDelete, setPersonalityIdDelete] = useState<string | null>(
    null
  );

  const [name, setName] = useState("");
  const [createName, setCreateName] = useState("");

  const {
    data: personalitiesData,
    loading,
    error,
    refetchData,
  } = getPersonalities();

  const { refetchData: fetchEditPersonality } = editPersonality(
    editingPersonality,
    { name: name }
  );

  const { refetchData: fetchCreatePersonality } = createPersonality({
    name: createName,
  });

  const { refetchData: fetchDeleteCommand } = deletePersonality(
    personalityIdDelete ? personalityIdDelete : ""
  );

  useEffect(() => {
    handleDeleteLayout<Personality>(
      personalityIdDelete,
      setPersonalityIdDelete,
      () => {
        fetchDeleteCommand().then(() => {
          refetchData();
          addNotification(
            "Deleted",
            "Personality deleted successfully",
            "danger"
          );
          setPersonalityIdDelete(null);
        });
      }
    );
  }, [personalityIdDelete]);

  if (error) return <>There is an error. {error.response?.data.message}</>;
  if (loading || !personalitiesData) return <> Loading...</>;

  const { data, count, currentPage } = personalitiesData;

  const createNewPersonality = () => {
    fetchCreatePersonality().then(() => {
      addNotification("Success", "Personality created successfully", "success");
      refetchData();
    });
  };

  const onSubmitEditModal = () => {
    fetchEditPersonality().then(() => {
      addNotification("Success", "Personality edited successfully", "success");
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

  const handleOnEdit = (personality: Personality) => {
    setEditingPersonality(personality._id);
    setName(personality.name);
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
              onClick={createNewPersonality}
              className="common-button primary-button"
            >
              Create
            </button>
          </div>
        </div>
        {data.map((personality, index) => {
          return (
            <div key={index} className="mode-item">
              <button
                onClick={() => handleOnEdit(personality)}
                className="common-button primary-button edit-mode-button"
              >
                {personality.name}
              </button>
              <button
                onClick={() => setPersonalityIdDelete(personality._id)}
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
          localStorageName="personalitiesListPageSize"
          currentPage={currentPage}
          totalCount={count}
          siblingCount={1}
        />
      </div>
      <Modal
        title="Edit personality"
        onClose={() => onCloseModal()}
        onSubmit={() => {
          onSubmitEditModal();
        }}
        show={showModal}
      >
        <div className="personalities-list-modal-wrapper">
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
