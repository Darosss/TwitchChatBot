import "./style.css";

import React, { useEffect, useState } from "react";
import Pagination from "@components/pagination";
import Modal from "@components/modal";
import PreviousPage from "@components/previousPage";
import {
  getMoods,
  editMood,
  createMood,
  deleteMood,
  Mood,
} from "@services/MoodService";
import { handleDeleteLayout } from "@utils/handleDeleteApi";
import { addNotification } from "@utils/getNotificationValues";
import FilterBarModes from "../filterBarModes";

export default function Moods() {
  const [showModal, setShowModal] = useState(false);

  const [editingMood, setEditingMood] = useState("");
  const [moodIdDelete, setMoodIdDelete] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [createName, setCreateName] = useState("");

  const { data: moodsData, loading, error, refetchData } = getMoods();

  const { refetchData: fetchEditMood } = editMood(editingMood, { name: name });

  const { refetchData: fetchCreateMood } = createMood({
    name: createName,
  });

  const { refetchData: fetchDeleteCommand } = deleteMood(
    moodIdDelete ? moodIdDelete : ""
  );

  useEffect(() => {
    handleDeleteLayout<Mood>(moodIdDelete, setMoodIdDelete, () => {
      fetchDeleteCommand().then(() => {
        refetchData();
        addNotification("Deleted", "Mood deleted successfully", "danger");
        setMoodIdDelete(null);
      });
    });
  }, [moodIdDelete]);

  if (error) return <>There is an error. {error.response?.data.message}</>;
  if (loading || !moodsData) return <> Loading...</>;

  const { data, count, currentPage } = moodsData;

  const createNewMood = () => {
    fetchCreateMood().then(() => {
      addNotification("Success", "Mood created successfully", "success");
      refetchData();
    });
  };

  const onSubmitEditModal = () => {
    fetchEditMood().then(() => {
      addNotification("Success", "Mood edited successfully", "success");
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

  const handleOnEdit = (mood: Mood) => {
    setEditingMood(mood._id);
    setName(mood.name);
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
              onClick={createNewMood}
              className="common-button primary-button"
            >
              Create
            </button>
          </div>
        </div>
        {data.map((mood, index) => {
          return (
            <div key={index} className="mode-item">
              <button
                onClick={() => handleOnEdit(mood)}
                className="common-button primary-button edit-mode-button"
              >
                {mood.name}
              </button>
              <button
                onClick={() => setMoodIdDelete(mood._id)}
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
          localStorageName="moodsListPageSize"
          currentPage={currentPage}
          totalCount={count}
          siblingCount={1}
        />
      </div>
      <Modal
        title="Edit mood"
        onClose={() => onCloseModal()}
        onSubmit={() => {
          onSubmitEditModal();
        }}
        show={showModal}
      >
        <div className="moods-list-modal-wrapper">
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
