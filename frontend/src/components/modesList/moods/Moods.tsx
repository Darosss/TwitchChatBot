import React, { useState } from "react";
import Pagination from "@components/pagination";
import Modal from "@components/modal";
import PreviousPage from "@components/previousPage";
import {
  useGetMoods,
  useEditMood,
  useCreateMood,
  useDeleteMood,
  Mood,
} from "@services";
import { addSuccessNotification } from "@utils";
import FilterBarModes from "../filterBarModes";
import ModalDataWrapper from "@components/modalDataWrapper";
import { AxiosError, Loading } from "@components/axiosHelper";
import { useAxiosWithConfirmation } from "@hooks";

export default function Moods() {
  const [showModal, setShowModal] = useState(false);

  const [editingMood, setEditingMood] = useState("");

  const [name, setName] = useState("");
  const [createName, setCreateName] = useState("");
  const [prefixes, setPrefixes] = useState([""]);
  const [sufixes, setSufixes] = useState([""]);

  const { data: moodsData, loading, error, refetchData } = useGetMoods();

  const { refetchData: fetchEditMood } = useEditMood(editingMood, {
    name: name,
    sufixes: sufixes,
    prefixes: prefixes,
  });

  const { refetchData: fetchCreateMood } = useCreateMood({
    name: createName,
    prefixes: prefixes,
    sufixes: sufixes,
  });

  const setMoodIdToDelete = useAxiosWithConfirmation({
    hookToProceed: useDeleteMood,
    opts: { onFullfiled: () => refetchData() },
  });

  if (error) return <AxiosError error={error} />;
  if (loading || !moodsData) return <Loading />;

  const { data, count, currentPage } = moodsData;

  const createNewMood = () => {
    fetchCreateMood().then(() => {
      addSuccessNotification("Mood created successfully");
      refetchData();
    });
  };

  const onSubmitEditModal = () => {
    fetchEditMood().then(() => {
      addSuccessNotification("Mood edited successfully");
      refetchData();
    });
    setShowModal(false);
  };

  const onCloseModal = () => {
    setShowModal(false);
  };

  const handleOnEdit = (mood: Mood) => {
    setEditingMood(mood._id);
    setName(mood.name);
    setPrefixes(mood.prefixes);
    setSufixes(mood.sufixes);
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
              onClick={createNewMood}
              className="common-button primary-button"
            >
              Create
            </button>
          </div>
        </div>
        {data.map((mood, index) => (
          <div key={index} className="mode-item">
            <button
              onClick={() => handleOnEdit(mood)}
              className="common-button primary-button edit-mode-button"
            >
              {mood.name}
            </button>
            <button
              onClick={() => setMoodIdToDelete(mood._id)}
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
        <ModalDataWrapper>
          <div>Name</div>
          <div>
            <input
              className="triggers-list-input"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </div>
          <div>Prefixes</div>
          <div>
            <textarea
              className="triggers-list-input"
              value={prefixes.join("\n")}
              onChange={(e) => {
                setPrefixes(e.target.value.split("\n"));
              }}
            />
          </div>
          <div>Sufixes</div>
          <div>
            <textarea
              className="triggers-list-input"
              value={sufixes.join("\n")}
              onChange={(e) => {
                setSufixes(e.target.value.split("\n"));
              }}
            />
          </div>
        </ModalDataWrapper>
      </Modal>
    </>
  );
}
