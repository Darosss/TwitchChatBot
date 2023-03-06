import "./style.css";

import React, { useContext, useEffect, useState } from "react";
import Pagination from "@components/pagination";
import Modal from "@components/modal";
import formatDate from "@utils/formatDate";
import PreviousPage from "@components/previousPage";
import FilterBarTriggers from "./filterBarTriggers";
import TriggerService from "@services/TriggerService";
import { SocketContext } from "@context/SocketContext";

export default function TriggersList() {
  const socket = useContext(SocketContext);

  const [showModal, setShowModal] = useState(false);

  const [editingTrigger, setEditingTrigger] = useState("");
  const [triggerIdDelete, setTriggerIdDelete] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [chance, setChance] = useState<number>();
  const [enabled, setEnabled] = useState(true);
  const [delay, setDelay] = useState<number>();
  const [messages, setMessages] = useState([""]);
  const [words, setWords] = useState([""]);

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
    if (
      triggerIdDelete !== null &&
      confirm(`Are you sure you want to delete command: ${triggerIdDelete}?`)
    ) {
      fetchDeleteCommand().then(() => {
        socketRefreshTrigger();
        refetchData();
        setTriggerIdDelete(null);
      });
    } else {
      setTriggerIdDelete(null);
    }
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
                  className="create-triggers triggers-list-button"
                  onClick={(e) => createNewTrigger()}
                >
                  New
                </button>
              </th>
              <th>Name</th>
              <th>Enabled</th>
              <th>Chance</th>
              <th>Delay</th>
              <th>Created</th>
              <th>Words</th>
              <th>Messages</th>
            </tr>
          </thead>

          <tbody>
            {data.map((trigger) => {
              return (
                <tr key={trigger._id}>
                  <td>
                    <button
                      className="triggers-action triggers-list-button"
                      onClick={() => {
                        setEditingTrigger(trigger._id);
                        setName(trigger.name);
                        setChance(trigger.chance);
                        setDelay(trigger.delay);
                        setMessages(trigger.messages);
                        setWords(trigger.words);
                        setShowModal(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="triggers-action triggers-list-button triggers-delete"
                      onClick={() => setTriggerIdDelete(trigger._id)}
                    >
                      Delete
                    </button>
                  </td>
                  <td> {trigger.name} </td>
                  <td>{trigger.enabled.toString()}</td>
                  <td>{trigger.chance}%</td>
                  <td>{trigger.delay}sec</td>
                  <td>
                    <div className="tooltip">
                      {formatDate(trigger.createdAt, "days+time")}
                      <span className="tooltiptext">
                        {formatDate(trigger.createdAt)}
                      </span>
                    </div>
                  </td>
                  <td className="triggers-big">{trigger.words.join("\n")}</td>
                  <td className="triggers-big">
                    {trigger.messages.join("\n")}
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
        <table className="triggers-list-modal-wrapper">
          <tbody>
            <tr>
              <th>Name </th>
              <td>
                <input
                  className="triggers-list-name"
                  type="text"
                  defaultValue={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    changeColorOnChange(e);
                  }}
                />
              </td>
            </tr>
            <tr>
              <th> Enabled </th>
              <td>
                <button
                  onClick={(e) => toggleOnOffTrigger(e)}
                  className={
                    `${!true ? "triggers-disabled" : ""} ` +
                    "triggers-list-button"
                  }
                >
                  {enabled.toString()}
                </button>
              </td>
            </tr>

            <tr>
              <th>Chance </th>
              <td>
                <input
                  defaultValue={chance}
                  onChange={(e) => {
                    setChance(Number(e.target.value));
                    changeColorOnChange(e);
                  }}
                />
              </td>
            </tr>
            <tr>
              <th>Delay </th>
              <td>
                <input
                  defaultValue={delay}
                  onChange={(e) => {
                    setDelay(Number(e.target.value));
                    changeColorOnChange(e);
                  }}
                />
              </td>
            </tr>
            <tr>
              <th>Words </th>
              <td>
                <textarea
                  className="triggers-textarea"
                  defaultValue={words?.join("\n")}
                  onChange={(e) => {
                    setWords(e.target.value?.split("\n"));
                    changeColorOnChange(e);
                  }}
                />
              </td>
            </tr>
            <tr>
              <th>Messages </th>
              <td>
                <textarea
                  className="triggers-textarea"
                  defaultValue={messages?.join("\n")}
                  onChange={(e) => {
                    setMessages(e.target.value?.split("\n"));
                    changeColorOnChange(e);
                  }}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </Modal>
    </>
  );
}
