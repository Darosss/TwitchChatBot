import React, { useEffect, useReducer, useState } from "react";
import Pagination from "@components/pagination";
import Modal from "@components/modal";
import PreviousPage from "@components/previousPage";
import FilterBarTimers from "./filterBarTimers";
import {
  Timer,
  getTimers,
  editTimer,
  createTimer,
  deleteTimer,
  TimerCreateData,
} from "@services/TimerService";
import { socketEmitRefreshTimers } from "@context/socket";
import { handleActionOnChangeState } from "@utils/handleDeleteApi";
import { addNotification } from "@utils/getNotificationValues";
import { getAllModes } from "@utils/getListModes";
import { DispatchAction } from "./types";
import TimersData from "./TimersData";
import TimerModalData from "./TimerModalData";

export default function TimersList() {
  const [showModal, setShowModal] = useState(false);

  const [editingTimer, setEditingTimer] = useState("");
  const [timerIdDelete, setTimerIdDelete] = useState<string | null>(null);

  const [state, dispatch] = useReducer(reducer, initialState);

  const modes = getAllModes();

  const { data: commandsData, loading, error, refetchData } = getTimers();

  const { refetchData: fetchEditTimer } = editTimer(editingTimer, state);
  const { refetchData: fetchCreateTimer } = createTimer(state);
  const { refetchData: fetchDeleteCommand } = deleteTimer(timerIdDelete || "");

  useEffect(() => {
    handleActionOnChangeState(timerIdDelete, setTimerIdDelete, () => {
      fetchDeleteCommand().then(() => {
        refetchData();
        addNotification("Deleted", "Timer deleted successfully", "danger");
        setTimerIdDelete(null);
      });
    });
  }, [timerIdDelete]);

  if (error) return <>There is an error. {error.response?.data.message}</>;
  if (loading || !commandsData || !modes) return <> Loading...</>;

  const { data, count, currentPage } = commandsData;

  const onSubmitModalCreate = () => {
    fetchCreateTimer().then(() => {
      socketEmitRefreshTimers();
      addNotification("Success", "Timer created successfully", "success");
      refetchData();
      setShowModal(false);
    });
  };

  const onSubmitModalEdit = () => {
    fetchEditTimer().then(() => {
      socketEmitRefreshTimers();
      addNotification("Success", "Timer edited successfully", "success");
      refetchData();
      handleOnHideModal();
    });
  };

  const setState = (timer: Timer) => {
    dispatch({
      type: "SET_STATE",
      payload: {
        name: timer.name,
        enabled: timer.enabled,
        delay: timer.delay,
        description: timer.description,
        nonFollowMulti: timer.nonFollowMulti,
        nonSubMulti: timer.nonSubMulti,
        reqPoints: timer.reqPoints,
        messages: timer.messages,
        tag: timer.tag._id,
        mood: timer.mood._id,
      },
    });
  };

  const handleOnShowEditModal = (timer: Timer) => {
    setEditingTimer(timer._id);
    setState(timer);
    setShowModal(true);
  };

  const handleOnShowCreateModal = (timer?: Timer) => {
    if (timer) {
      setState(timer);
    } else {
      dispatch({ type: "SET_STATE", payload: initialState });
    }
    setShowModal(true);
  };

  const handleOnHideModal = () => {
    setShowModal(false);
    setEditingTimer("");
  };

  return (
    <>
      <PreviousPage />
      <FilterBarTimers />
      <TimersData
        data={data}
        handleOnShowCreateModal={handleOnShowCreateModal}
        handleOnShowEditModal={handleOnShowEditModal}
        setTimerIdToDelete={setTimerIdDelete}
      />
      <div className="table-list-pagination">
        <Pagination
          className="pagination-bar"
          localStorageName="timersListPageSize"
          currentPage={currentPage}
          totalCount={count}
          siblingCount={1}
        />
      </div>
      <Modal
        title={`${editingTimer ? "Edit" : "Create"} timer`}
        onClose={handleOnHideModal}
        onSubmit={() => {
          editingTimer ? onSubmitModalEdit() : onSubmitModalCreate();
        }}
        show={showModal}
      >
        <TimerModalData state={state} dispatch={dispatch} modes={modes} />
      </Modal>
    </>
  );
}

const initialState: TimerCreateData = {
  name: "",
  enabled: true,
  delay: 360,
  description: "",
  nonFollowMulti: false,
  nonSubMulti: false,
  reqPoints: 10,
  messages: [""],
  tag: "",
  mood: "",
};

function reducer(
  state: TimerCreateData,
  action: DispatchAction
): TimerCreateData {
  switch (action.type) {
    case "SET_NAME":
      return { ...state, name: action.payload };
    case "SET_ENABLED":
      return { ...state, enabled: action.payload || !state.enabled };
    case "SET_DELAY":
      return { ...state, delay: action.payload };
    case "SET_REQ_POINTS":
      return { ...state, reqPoints: action.payload };
    case "SET_NON_FOLLOW_MULTI":
      return {
        ...state,
        nonFollowMulti: action.payload || !state.nonFollowMulti,
      };
    case "SET_NON_SUB_MULTI":
      return { ...state, nonSubMulti: action.payload || !state.nonSubMulti };
    case "SET_DESC":
      return { ...state, description: action.payload };
    case "SET_MESSAGES":
      return { ...state, messages: action.payload };
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
