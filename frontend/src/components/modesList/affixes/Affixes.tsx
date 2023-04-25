import "./style.css";

import React, { useEffect, useState } from "react";
import Pagination from "@components/pagination";
import Modal from "@components/modal";
import PreviousPage from "@components/previousPage";
import {
  getAffixes,
  editAffix,
  createAffix,
  deleteAffix,
  Affix,
} from "@services/AffixService";
import { handleActionOnChangeState } from "@utils/handleDeleteApi";
import { addNotification } from "@utils/getNotificationValues";
import FilterBarModes from "../filterBarModes";
import ModalDataWrapper from "@components/modalDataWrapper";

export default function Affixes() {
  const [showModal, setShowModal] = useState(false);

  const [editingAffix, setEditingAffix] = useState("");
  const [affixIdDelete, setAffixIdDelete] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [createName, setCreateName] = useState("");

  const { data: affixesData, loading, error, refetchData } = getAffixes();

  const { refetchData: fetchEditAffix } = editAffix(editingAffix, {
    name: name,
  });

  const { refetchData: fetchCreateAffix } = createAffix({
    name: createName,
    prefixChance: 5,
    suffixChance: 5,
    prefixes: [""],
    suffixes: [""],
    //TODO:ADD states
  });

  const { refetchData: fetchDeleteAffix } = deleteAffix(
    affixIdDelete ? affixIdDelete : ""
  );

  useEffect(() => {
    handleActionOnChangeState(affixIdDelete, setAffixIdDelete, () => {
      fetchDeleteAffix()
        .then(() => {
          refetchData();
          addNotification("Deleted", "Affix deleted successfully", "danger");
          setAffixIdDelete(null);
        })
        .catch((err) => {
          addNotification("Warning", err.response.data.message, "warning");
        });
    });
  }, [affixIdDelete]);

  if (error) return <>There is an error. {error.response?.data.message}</>;
  if (loading || !affixesData) return <> Loading...</>;

  const { data, count, currentPage } = affixesData;

  const createNewAffix = () => {
    fetchCreateAffix().then(() => {
      addNotification("Success", "Affix created successfully", "success");
      refetchData();
    });
  };

  const onSubmitEditModal = () => {
    fetchEditAffix().then(() => {
      addNotification("Success", "Affix edited successfully", "success");
      refetchData();
    });
    setShowModal(false);
  };

  const onCloseModal = () => {
    setShowModal(false);
  };

  const handleOnEdit = (affix: Affix) => {
    setEditingAffix(affix._id);
    setName(affix.name);
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
              onClick={createNewAffix}
              className="common-button primary-button"
            >
              Create
            </button>
          </div>
        </div>
        {data.map((affix, index) => {
          return (
            <div key={index} className="mode-item">
              <button
                onClick={() => handleOnEdit(affix)}
                className="common-button primary-button edit-mode-button"
              >
                {affix.name}
              </button>
              <button
                onClick={() => setAffixIdDelete(affix._id)}
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
          localStorageName="affixesListPageSize"
          currentPage={currentPage}
          totalCount={count}
          siblingCount={1}
        />
      </div>
      <Modal
        title="Edit affix"
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
        </ModalDataWrapper>
      </Modal>
    </>
  );
}
