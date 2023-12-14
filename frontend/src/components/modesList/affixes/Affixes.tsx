import React, { useEffect, useState } from "react";
import Pagination from "@components/pagination";
import Modal from "@components/modal";
import PreviousPage from "@components/previousPage";
import {
  useGetAffixes,
  useEditAffix,
  useCreateAffix,
  useDeleteAffix,
  Affix,
} from "@services";
import { addSuccessNotification, handleActionOnChangeState } from "@utils";
import FilterBarModes from "../filterBarModes";
import ModalDataWrapper from "@components/modalDataWrapper";
import { AxiosError, Loading } from "@components/axiosHelper";

export default function Affixes() {
  const [showModal, setShowModal] = useState(false);

  const [editingAffix, setEditingAffix] = useState("");
  const [affixIdDelete, setAffixIdDelete] = useState<string | null>(null);

  const [createName, setCreateName] = useState("");
  const [name, setName] = useState("");
  const [prefixChance, setPrefixChance] = useState<number>(5);
  const [suffixChance, setSuffixChance] = useState<number>(5);
  const [prefixes, setPrefixes] = useState<string[]>([""]);
  const [suffixes, setSuffixes] = useState<string[]>([""]);

  const { data: affixesData, loading, error, refetchData } = useGetAffixes();

  const { refetchData: fetchEditAffix } = useEditAffix(editingAffix, {
    name: name,
    prefixes: prefixes,
    suffixes: suffixes,
    prefixChance: prefixChance,
    suffixChance: suffixChance,
  });

  const { refetchData: fetchCreateAffix } = useCreateAffix({
    name: createName,
  });

  const { refetchData: fetchDeleteAffix } = useDeleteAffix(
    affixIdDelete ? affixIdDelete : ""
  );

  useEffect(() => {
    handleActionOnChangeState(affixIdDelete, setAffixIdDelete, () => {
      fetchDeleteAffix().then(() => {
        refetchData();
        addSuccessNotification("Affix deleted successfully");
        setAffixIdDelete(null);
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [affixIdDelete]);

  if (error) return <AxiosError error={error} />;
  if (loading || !affixesData) return <Loading />;

  const { data, count, currentPage } = affixesData;

  const createNewAffix = () => {
    fetchCreateAffix().then(() => {
      addSuccessNotification("Affix created successfully");
      refetchData();
    });
  };

  const onSubmitEditModal = () => {
    fetchEditAffix().then(() => {
      addSuccessNotification("Affix edited successfully");
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
    setPrefixChance(affix.prefixChance);
    setSuffixChance(affix.suffixChance);
    setPrefixes(affix.prefixes);
    setSuffixes(affix.suffixes);
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
        {data.map((affix, index) => (
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
        ))}
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
          <div>PrefixChance</div>
          <div>
            <input
              className="triggers-list-input"
              type="number"
              value={prefixChance}
              min={0}
              max={100}
              onChange={(e) => {
                setPrefixChance(e.target.valueAsNumber);
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
          <div>SuffixChance</div>
          <div>
            <input
              className="triggers-list-input"
              type="number"
              value={suffixChance}
              min={0}
              max={100}
              onChange={(e) => {
                setSuffixChance(e.target.valueAsNumber);
              }}
            />
          </div>

          <div>Suffixes</div>
          <div>
            <textarea
              className="triggers-list-input"
              value={suffixes.join("\n")}
              onChange={(e) => {
                setSuffixes(e.target.value.split("\n"));
              }}
            />
          </div>
        </ModalDataWrapper>
      </Modal>
    </>
  );
}
