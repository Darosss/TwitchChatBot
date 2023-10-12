import React, { useEffect, useReducer, useState } from "react";
import Pagination from "@components/pagination";
import Modal from "@components/modal";
import PreviousPage from "@components/previousPage";
import FilterBarTriggers from "./filterBarTriggers";
import {
  Trigger,
  useGetTriggers,
  useEditTrigger,
  useCreateTrigger,
  useDeleteTrigger,
  TriggerCreateData,
} from "@services";
import { handleActionOnChangeState } from "@utils";
import { addNotification } from "@utils";
import { useGetAllModes } from "@utils";
import TriggersData from "./TriggersData";
import TriggerModalData from "./TriggerModalData";
import { DispatchAction } from "./types";
import { useSocketContext } from "@context/socket";

export default function TriggersList() {
  const [showModal, setShowModal] = useState(false);
  const {
    emits: { refreshTriggers: emitRefreshTriggers },
  } = useSocketContext();

  const [editingTrigger, setEditingTrigger] = useState("");
  const [triggerIdDelete, setTriggerIdDelete] = useState<string | null>(null);

  const [state, dispatch] = useReducer(reducer, initialState);

  const modes = useGetAllModes();

  const { data: commandsData, loading, error, refetchData } = useGetTriggers();

  const { refetchData: fetchEditTrigger } = useEditTrigger(
    editingTrigger,
    state
  );
  const { refetchData: fetchCreateTrigger } = useCreateTrigger(state);
  const { refetchData: fetchDeleteTrigger } = useDeleteTrigger(
    triggerIdDelete || ""
  );

  useEffect(() => {
    handleActionOnChangeState(triggerIdDelete, setTriggerIdDelete, () => {
      fetchDeleteTrigger().then(() => {
        refetchData();
        addNotification("Deleted", "Trigger deleted successfully", "danger");
        setTriggerIdDelete(null);
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerIdDelete]);

  if (error) return <>There is an error. {error.response?.data.message}</>;
  if (loading || !commandsData || !modes) return <> Loading...</>;

  const { data, count, currentPage } = commandsData;

  const onSubmitModalCreate = () => {
    fetchCreateTrigger().then(() => {
      emitRefreshTriggers();
      addNotification("Success", "Trigger created successfully", "success");
      refetchData();
      setShowModal(false);
    });
  };

  const onSubmitModalEdit = () => {
    fetchEditTrigger().then(() => {
      emitRefreshTriggers();
      addNotification("Success", "Trigger edited successfully", "success");
      refetchData();
      handleOnHideModal();
    });
  };

  const setState = (trigger: Trigger) => {
    dispatch({
      type: "SET_STATE",
      payload: {
        name: trigger.name,
        delay: trigger.delay,
        chance: trigger.chance,
        enabled: trigger.enabled,
        messages: trigger.messages,
        mode: trigger.mode,
        mood: trigger.mood._id,
        tag: trigger.tag._id,
        words: trigger.words,
      },
    });
  };

  const handleOnShowEditModal = (trigger: Trigger) => {
    setEditingTrigger(trigger._id);
    setState(trigger);
    setShowModal(true);
  };

  const handleOnShowCreateModal = (trigger?: Trigger) => {
    if (trigger) {
      setState(trigger);
    } else {
      dispatch({ type: "SET_STATE", payload: initialState });
    }

    setShowModal(true);
  };

  const handleOnHideModal = () => {
    setShowModal(false);
    setEditingTrigger("");
  };

  return (
    <>
      <PreviousPage />
      <FilterBarTriggers />
      <TriggersData
        data={data}
        handleOnShowCreateModal={handleOnShowCreateModal}
        handleOnShowEditModal={handleOnShowEditModal}
        setTriggerIdDelete={setTriggerIdDelete}
      />
      <div className="table-list-pagination">
        <Pagination
          className="pagination-bar"
          localStorageName="triggersListPageSize"
          currentPage={currentPage}
          totalCount={count}
          siblingCount={1}
        />
      </div>
      <Modal
        title={`${editingTrigger ? "Edit" : "Create"} trigger`}
        onClose={handleOnHideModal}
        onSubmit={() => {
          editingTrigger ? onSubmitModalEdit() : onSubmitModalCreate();
        }}
        show={showModal}
      >
        <TriggerModalData state={state} dispatch={dispatch} modes={modes} />
      </Modal>
    </>
  );
}

const initialState: TriggerCreateData = {
  name: "",
  chance: 50,
  enabled: true,
  delay: 360,
  messages: [""],
  words: [""],
  mode: "ALL",
  tag: "",
  mood: "",
};

function reducer(
  state: TriggerCreateData,
  action: DispatchAction
): TriggerCreateData {
  switch (action.type) {
    case "SET_NAME":
      return { ...state, name: action.payload };
    case "SET_CHANCE":
      return { ...state, chance: action.payload };
    case "SET_ENABLED":
      return { ...state, enabled: action.payload || !state.enabled };
    case "SET_DELAY":
      return { ...state, delay: action.payload };
    case "SET_MESSAGES":
      return { ...state, messages: action.payload };
    case "SET_WORDS":
      return { ...state, words: action.payload };
    case "SET_MODE":
      return { ...state, mode: action.payload };
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
