import "./style.css";

import React, { useContext, useEffect, useState } from "react";
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
} from "@services/TimerService";
import { SocketContext } from "@context/SocketContext";
import { handleDeleteLayout } from "@utils/handleDeleteApi";
import { addNotification } from "@utils/getNotificationValues";
import { DateTooltip } from "@components/dateTooltip";

export default function TimersList() {
  const socket = useContext(SocketContext);

  const [showModal, setShowModal] = useState(false);

  const [editingTimer, setEditingTimer] = useState("");
  const [timerIdDelete, setTimerIdDelete] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [enabled, setEnabled] = useState(true);
  const [delay, setDelay] = useState(360);
  const [nonFollowMulti, setNonFollowMulti] = useState(false);
  const [nonSubMulti, setNonSubMulti] = useState(false);
  const [messages, setMessages] = useState([""]);
  const [description, setDescription] = useState("");
  const [reqPoints, setReqPoints] = useState(10);

  const { data: commandsData, loading, error, refetchData } = getTimers();

  const { refetchData: fetchEditTimer } = editTimer(editingTimer, {
    name: name,
    enabled: enabled,
    delay: delay,
    messages: messages,
    nonFollowMulti: nonFollowMulti,
    nonSubMulti: nonSubMulti,
    description: description,
    reqPoints: reqPoints,
  });

  const { refetchData: fetchCreateTimer } = createTimer({
    name: `New timer${commandsData?.count}`,
    enabled: true,
    delay: 360,
    description: "New timer description",
    nonFollowMulti: false,
    nonSubMulti: false,
    reqPoints: 10,
    messages: [`New timer${commandsData?.count} default message`],
  });

  const { refetchData: fetchDeleteCommand } = deleteTimer(
    timerIdDelete ? timerIdDelete : ""
  );

  const socketRefreshTimer = () => {
    socket?.emit("refreshTimers");
  };

  useEffect(() => {
    handleDeleteLayout<Timer>(timerIdDelete, setTimerIdDelete, () => {
      fetchDeleteCommand().then(() => {
        refetchData();
        addNotification("Deleted", "Timer deleted successfully", "danger");
        setTimerIdDelete(null);
      });
    });
  }, [timerIdDelete]);

  if (error) return <>There is an error. {error.response?.data.message}</>;
  if (loading || !commandsData) return <> Loading...</>;

  const { data, count, currentPage } = commandsData;

  const createNewTimer = () => {
    fetchCreateTimer().then(() => {
      socketRefreshTimer();
      addNotification("Success", "Timer created successfully", "success");
      refetchData();
    });
  };

  const onSubmitEditModal = () => {
    fetchEditTimer().then(() => {
      socketRefreshTimer();
      addNotification("Success", "Timer edited successfully", "success");
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

  const handleOnEdit = (timer: Timer) => {
    setEditingTimer(timer._id);
    setName(timer.name);
    setDelay(timer.delay);
    setMessages(timer.messages);
    setReqPoints(timer.reqPoints);
    setShowModal(true);
    setEnabled(timer.enabled);
    setNonFollowMulti(timer.nonFollowMulti);
    setNonSubMulti(timer.nonSubMulti);
  };

  return (
    <>
      <PreviousPage />
      <FilterBarTimers />

      <div id="timers-list" className="table-list-wrapper">
        <table id="table-timers-list">
          <thead>
            <tr>
              <th>
                Actions
                <button
                  className="common-button primary-button"
                  onClick={(e) => createNewTimer()}
                >
                  New
                </button>
              </th>
              <th colSpan={5}>Data</th>
              <th>Messages</th>
            </tr>
          </thead>

          <tbody>
            {data.map((timer) => {
              return (
                <tr key={timer._id}>
                  <td>
                    <div className="timers-list-action-buttons-wrapper">
                      <button
                        className="common-button primary-button"
                        onClick={() => {
                          handleOnEdit(timer);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="common-button danger-button"
                        onClick={() => setTimerIdDelete(timer._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                  <td colSpan={5}>
                    <div className="timer-div-data">
                      <div>Name: </div>
                      <div>{timer.name}</div>
                      <div>Delay: </div>
                      <div>{timer.delay}</div>
                      <div>Points: </div>
                      <div>{timer.points}</div>
                      <div>Required points: </div>
                      <div>{timer.reqPoints}</div>
                      <div>Enabled: </div>
                      <div
                        style={{
                          background: `${timer.enabled ? "green" : "red"}`,
                        }}
                      >
                        {timer.enabled.toString()}
                      </div>
                      <div>Uses: </div>
                      <div>{timer.uses}</div>
                      <div>Non follow multi: </div>
                      <div>{timer.nonFollowMulti.toString()}</div>
                      <div>Non sub multi:</div>
                      <div>{timer.nonSubMulti.toString()}</div>
                      <div>Description:</div>
                      <div>{timer.description}</div>
                      <div>Created at:</div>
                      <div>
                        <DateTooltip date={timer.createdAt} />
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="timers-big timers-messages">
                      {timer.messages.map((message, index) => {
                        return <div key={index}>{message}</div>;
                      })}
                    </div>
                  </td>
                  <td></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
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
        title="Edit timer"
        onClose={() => onCloseModal()}
        onSubmit={() => {
          onSubmitEditModal();
        }}
        show={showModal}
      >
        <div className="timers-list-modal-wrapper">
          <div>Name</div>
          <div>
            <input
              className="timers-list-input"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                changeColorOnChange(e);
              }}
            />
          </div>

          <div> Enabled </div>
          <div>
            <button
              onClick={() => setEnabled(!enabled)}
              className={
                `${!enabled ? "danger-button" : "primary-button"} ` +
                "common-button "
              }
            >
              {enabled.toString()}
            </button>
          </div>

          <div>Non follow multi </div>
          <div>
            <button
              onClick={() => setNonFollowMulti(!nonFollowMulti)}
              className={
                `${!nonFollowMulti ? "danger-button" : "primary-button"} ` +
                "common-button "
              }
            >
              {nonFollowMulti.toString()}
            </button>
          </div>
          <div>Non sub multi </div>
          <div>
            <button
              onClick={() => setNonSubMulti(!nonSubMulti)}
              className={
                `${!nonSubMulti ? "danger-button" : "primary-button"} ` +
                "common-button "
              }
            >
              {nonSubMulti.toString()}
            </button>
          </div>
          <div>Delay</div>
          <div>
            <input
              className="timers-list-input"
              type="number"
              value={delay}
              onChange={(e) => {
                setDelay(e.target.valueAsNumber);
                changeColorOnChange(e);
              }}
            />
          </div>
          <div>Req points</div>
          <div>
            <input
              className="timers-list-input"
              type="number"
              value={reqPoints}
              onChange={(e) => {
                setReqPoints(Number(e.target.value));
                changeColorOnChange(e);
              }}
            />
          </div>
          <div>description </div>
          <div>
            <input
              className="timers-list-input"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                changeColorOnChange(e);
              }}
            />
          </div>
          <div>Messages</div>
          <div>
            <textarea
              className="timers-textarea"
              value={messages?.join("\n")}
              onChange={(e) => {
                setMessages(e.target.value?.split("\n"));
                changeColorOnChange(e);
              }}
            />
          </div>
        </div>
      </Modal>
    </>
  );
}
