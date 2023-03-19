import "./style.css";

import React, { useContext, useEffect, useState } from "react";
import Pagination from "@components/pagination";
import Modal from "@components/modal";
import formatDate from "@utils/formatDate";
import PreviousPage from "@components/previousPage";
import FilterBarTriggers from "./filterBarTriggers";
import TriggerService, {
  ITrigger,
  ITriggerMode,
} from "@services/TriggerService";
import { SocketContext } from "@context/SocketContext";
import { handleDeleteLayout } from "@utils/handleDeleteApi";

export default function TriggersList() {
  const socket = useContext(SocketContext);

  const [showModal, setShowModal] = useState(false);

  const [editingTrigger, setEditingTrigger] = useState("");
  const [triggerIdDelete, setTriggerIdDelete] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [chance, setChance] = useState<number>(0);
  const [enabled, setEnabled] = useState(true);
  const [delay, setDelay] = useState<number>(0);
  const [messages, setMessages] = useState([""]);
  const [words, setWords] = useState([""]);
  const [mode, setMode] = useState<ITriggerMode>("ALL");

  const {
    data: commandsData,
    loading,
    error,
    refetchData,
  } = TriggerService.getTriggers();

  const { refetchData: fetchEditTrigger } = TriggerService.editTrigger(
    editingTrigger,
    {
      name: name,
      enabled: enabled,
      chance: chance || 50,
      delay: delay,
      messages: messages,
      words: words,
      mode: mode,
    }
  );

  const { refetchData: fetchCreateTrigger } = TriggerService.createTrigger({
    name: `New trigger${commandsData?.count}`,
    delay: 180,
    enabled: true,
    chance: chance,
    words: [`New trigger${commandsData?.count} default word`],
    messages: [`New trigger${commandsData?.count} default message`],
  });

  const { refetchData: fetchDeleteCommand } = TriggerService.deleteTrigger(
    triggerIdDelete ? triggerIdDelete : ""
  );

  const socketRefreshTrigger = () => {
    socket?.emit("refreshTriggers");
  };

  useEffect(() => {
    handleDeleteLayout<ITrigger>(triggerIdDelete, setTriggerIdDelete, () => {
      fetchDeleteCommand().then(() => {
        refetchData();
        setTriggerIdDelete(null);
      });
    });
  }, [triggerIdDelete]);

  if (error) return <>There is an error. {error.response?.data.message}</>;
  if (loading || !commandsData) return <> Loading...</>;

  const { data, count, currentPage } = commandsData;

  const createNewTrigger = () => {
    fetchCreateTrigger().then(() => {
      socketRefreshTrigger();
      refetchData();
    });
  };

  const onSubmitEditModal = () => {
    fetchEditTrigger().then(() => {
      socketRefreshTrigger();
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

  const toggleOnOffTrigger = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    (e.target as HTMLButtonElement).classList.toggle("triggers-disabled");
    setEnabled((prevState) => {
      return !prevState;
    });
  };

  return (
    <>
      <PreviousPage />
      <FilterBarTriggers />

      <div id="triggers-list" className="table-list-wrapper">
        <table id="table-triggers-list">
          <thead>
            <tr>
              <th>
                Actions
                <button
                  className="common-button primary-button"
                  onClick={(e) => createNewTrigger()}
                >
                  New
                </button>
              </th>
              <th colSpan={5}>Data</th>
              <th>Words</th>
              <th>Messages</th>
              <th>Created</th>
            </tr>
          </thead>

          <tbody>
            {data.map((trigger) => {
              return (
                <tr key={trigger._id}>
                  <td>
                    <div className="triggers-list-action-buttons-wrapper">
                      <button
                        className="common-button primary-button"
                        onClick={() => {
                          setEditingTrigger(trigger._id);
                          setName(trigger.name);
                          setChance(trigger.chance);
                          setDelay(trigger.delay);
                          setMessages(trigger.messages);
                          setWords(trigger.words);
                          setShowModal(true);
                          setMode(trigger.mode);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="common-button danger-button"
                        onClick={() => setTriggerIdDelete(trigger._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                  <td colSpan={5}>
                    <div className="trigger-div-data">
                      <div>Name: </div>
                      <div>{trigger.name}</div>
                      <div>Chance: </div>
                      <div>{trigger.chance}</div>
                      <div>Enabled: </div>
                      <div
                        style={{
                          background: `${trigger.enabled ? "green" : "red"}`,
                        }}
                      >
                        {trigger.enabled.toString()}
                      </div>
                      <div>Delay: </div>
                      <div>{trigger.delay}</div>
                      <div>Uses: </div>
                      <div>{trigger.uses}</div>
                      <div>Delay: </div>
                      <div>{trigger.delay}</div>
                      <div>Mode:</div>
                      <div>{trigger.mode}</div>
                    </div>
                  </td>
                  <td>
                    <div className="triggers-big triggers-words">
                      {trigger.words.map((word, index) => {
                        return <div key={index}>{word}</div>;
                      })}
                    </div>
                  </td>
                  <td>
                    <div className=" triggers-big triggers-messages">
                      {trigger.messages.map((message, index) => {
                        return <div key={index}>{message}</div>;
                      })}
                    </div>
                  </td>
                  <td>
                    <div className="tooltip">
                      {formatDate(trigger.createdAt, "days+time")}
                      <span className="tooltiptext">
                        {formatDate(trigger.createdAt)}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
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
        title="Edit trigger"
        onClose={() => onCloseModal()}
        onSubmit={() => {
          onSubmitEditModal();
        }}
        show={showModal}
      >
        <div className="triggers-list-modal-wrapper">
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
          <div> Enabled </div>
          <div>
            <button
              onClick={(e) => toggleOnOffTrigger(e)}
              className={
                `${!true ? "danger-button" : "primary-button"} ` +
                "common-button "
              }
            >
              {enabled.toString()}
            </button>
          </div>
          <div>Chance </div>
          <div>
            <input
              className="triggers-list-input"
              value={chance}
              onChange={(e) => {
                setChance(Number(e.target.value));
                changeColorOnChange(e);
              }}
            />
          </div>
          <div>Mode </div>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as ITriggerMode)}
          >
            {["ALL", "STARTS-WITH", "WHOLE-WORD"].map((modeTrigger, index) => {
              return (
                <option key={index} value={modeTrigger}>
                  {modeTrigger}
                </option>
              );
            })}
          </select>
          <div>Delay</div>
          <div>
            <input
              className="triggers-list-input"
              value={delay}
              onChange={(e) => {
                setDelay(Number(e.target.value));
                changeColorOnChange(e);
              }}
            />
          </div>
          <div>Words</div>
          <div>
            <textarea
              className="triggers-textarea"
              value={words?.join("\n")}
              onChange={(e) => {
                setWords(e.target.value?.split("\n"));
                changeColorOnChange(e);
              }}
            />
          </div>
          <div>Messages</div>
          <div>
            <textarea
              className="triggers-textarea"
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
