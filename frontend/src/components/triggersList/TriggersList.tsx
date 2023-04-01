import "./style.css";
import React, { useEffect, useReducer, useState } from "react";
import Pagination from "@components/pagination";
import Modal from "@components/modal";
import PreviousPage from "@components/previousPage";
import FilterBarTriggers from "./filterBarTriggers";
import {
  Trigger,
  getTriggers,
  editTrigger,
  createTrigger,
  deleteTrigger,
  TriggerCreateData,
} from "@services/TriggerService";
import { socketEmitRefreshTriggers } from "@context/SocketContext";
import { handleActionOnChangeState } from "@utils/handleDeleteApi";
import { addNotification } from "@utils/getNotificationValues";
import { getAllModes } from "@utils/getListModes";
import TriggersData from "./TriggersData";
import TriggerModalData from "./TriggerModalData";
import { DispatchAction } from "./types";

export default function TriggersList() {
  const [showModal, setShowModal] = useState(false);

  const [editingTrigger, setEditingTrigger] = useState("");
  const [triggerIdDelete, setTriggerIdDelete] = useState<string | null>(null);

  const [state, dispatch] = useReducer(reducer, initialState);

  const modes = getAllModes();

  const { data: commandsData, loading, error, refetchData } = getTriggers();

  const { refetchData: fetchEditTrigger } = editTrigger(editingTrigger, state);
  const { refetchData: fetchCreateTrigger } = createTrigger(state);
  const { refetchData: fetchDeleteTrigger } = deleteTrigger(
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
  }, [triggerIdDelete]);

  if (error) return <>There is an error. {error.response?.data.message}</>;
  if (loading || !commandsData || !modes) return <> Loading...</>;

  const { data, count, currentPage } = commandsData;

  const onSubmitModalCreate = () => {
    fetchCreateTrigger().then(() => {
      socketEmitRefreshTriggers();
      addNotification("Success", "Trigger created successfully", "success");
      refetchData();
      setShowModal(false);
    });
  };

  const onSubmitModalEdit = () => {
    fetchEditTrigger().then(() => {
      socketEmitRefreshTriggers();
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
        personality: trigger.personality._id,
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
  personality: "",
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
