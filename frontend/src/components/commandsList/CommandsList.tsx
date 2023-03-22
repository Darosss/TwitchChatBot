import "./style.css";

import React, { useContext, useEffect, useState } from "react";
import FilterBarCommands from "./filterBarCommands";
import Modal from "@components/modal";
import Pagination from "@components/pagination";
import PreviousPage from "@components/previousPage";
import { SocketContext } from "@context/SocketContext";
import { handleDeleteLayout } from "@utils/handleDeleteApi";
import {
  getCommands,
  editCommand,
  createCommand,
  deleteCommand,
  ChatCommand,
} from "@services/ChatCommandService";
import { addNotification } from "@utils/getNotificationValues";
import { DateTooltip } from "@components/dateTooltip";

export default function CommandsList() {
  const socket = useContext(SocketContext);

  const [showModal, setShowModal] = useState(false);

  const [editingCommand, setEditingCommand] = useState("");
  const [commandIdDelete, setCommandIdDelete] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [enabled, setEnabled] = useState(true);
  const [aliases, setAliases] = useState([""]);
  const [messages, setMessages] = useState([""]);
  const [privilege, setPrivilege] = useState<number>(0);

  const { data: commandsData, loading, error, refetchData } = getCommands();

  const socketRefreshTrigger = () => {
    socket?.emit("refreshCommands");
  };
  useEffect(() => {
    handleDeleteLayout<ChatCommand>(commandIdDelete, setCommandIdDelete, () => {
      fetchDeleteCommand().then(() => {
        refetchData();
        addNotification("Deleted", `Command deleted successfully`, "danger");

        setCommandIdDelete(null);
      });
    });
  }, [commandIdDelete]);

  const { refetchData: fetchEditComman } = editCommand(editingCommand, {
    name: name,
    description: description,
    enabled: enabled,
    aliases: aliases,
    messages: messages,
    privilege: privilege || 0,
  });

  const { error: createCommandError, refetchData: fetchCreateCommand } =
    createCommand({
      name: `New command${commandsData?.count}`,
      description: `New command description${commandsData?.count}`,
      enabled: true,
      aliases: [`New command${commandsData?.count} default alias`],
      messages: [`New command${commandsData?.count} default message`],
      privilege: 0,
    });

  const { refetchData: fetchDeleteCommand } = deleteCommand(
    commandIdDelete ? commandIdDelete : ""
  );

  if (error) return <>There is an error. {error.response?.data.message}</>;
  if (createCommandError)
    alert(
      ` There is an error with create command.
        ${createCommandError.response?.data.message}`
    );
  if (loading || !commandsData) return <> Loading...</>;

  const { data, count, currentPage } = commandsData;

  const createNewCommand = () => {
    fetchCreateCommand().then(() => {
      socketRefreshTrigger();
      refetchData();

      addNotification("Success", "Command created successfully", "success");
    });
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

  const toggleOnOffCommand = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    (e.target as HTMLButtonElement).classList.toggle("command-disabled");
    setEnabled((prevState) => {
      return !prevState;
    });
  };

  const onSubmitEditModal = () => {
    fetchEditComman().then(() => {
      socketRefreshTrigger();
      refetchData();
      addNotification("Success", "Command edited successfully", "success");
    });
    resetOnChangeClasses();
    setShowModal(false);
  };

  const onCloseModal = () => {
    setShowModal(false);
    resetOnChangeClasses();
  };

  const handleOnEdit = (command: ChatCommand) => {
    setEditingCommand(command._id);
    setName(command.name);
    setDescription(command.description || "");
    setAliases(command.aliases);
    setMessages(command.messages);
    setPrivilege(command.privilege);
    setEnabled(command.enabled);
    setShowModal(true);
  };

  return (
    <>
      <PreviousPage />
      <FilterBarCommands />

      <div id="commands-list" className="table-list-wrapper">
        <table id="table-commands-list">
          <thead>
            <tr>
              <th>
                Actions
                <button
                  className="common-button primary-button"
                  onClick={(e) => createNewCommand()}
                >
                  New
                </button>
              </th>
              <th colSpan={5}>Data</th>
              <th>Aliases</th>
              <th>Messages</th>
            </tr>
          </thead>

          <tbody>
            {data.map((command) => {
              return (
                <tr key={command._id}>
                  <td>
                    <button
                      className="common-button primary-button"
                      onClick={() => handleOnEdit(command)}
                    >
                      Edit
                    </button>
                    <button
                      className="common-button danger-button"
                      onClick={() => setCommandIdDelete(command._id)}
                    >
                      Delete
                    </button>
                  </td>
                  <td colSpan={5}>
                    <div className="command-div-data">
                      <div>Name: </div>
                      <div>{command.name}</div>
                      <div>Uses: </div>
                      <div>{command.useCount}</div>
                      <div>Enabled: </div>
                      <div
                        style={{
                          background: `${command.enabled ? "green" : "red"}`,
                        }}
                      >
                        {command.enabled.toString()}
                      </div>
                      <div>Privilege: </div>
                      <div>{command.privilege}</div>
                      <div>Created at: </div>
                      <div>
                        <DateTooltip date={command.createdAt} />
                      </div>
                      <div>Description: </div>
                      <div>{command.description}</div>
                    </div>
                  </td>

                  <td>
                    <div className="commands-big">
                      {command.aliases.map((alias, index) => {
                        return <div key={index}>{alias}</div>;
                      })}
                    </div>
                  </td>
                  <td>
                    <div className="commands-big">
                      {command.messages.map((message, index) => {
                        return <div key={index}>{message}</div>;
                      })}
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
          localStorageName="commandsListPageSize"
          currentPage={currentPage}
          totalCount={count}
          siblingCount={1}
        />
      </div>
      <Modal
        title="Edit command"
        onClose={() => onCloseModal()}
        onSubmit={() => onSubmitEditModal()}
        show={showModal}
      >
        <div className="command-list-modal-wrapper">
          <div>Name </div>
          <div>
            <input
              className="commands-list-name"
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
              onClick={(e) => toggleOnOffCommand(e)}
              className={
                `${!true ? "danger-button" : "primary-button"} ` +
                "common-button"
              }
            >
              {enabled.toString()}
            </button>
          </div>

          <div>Privilege</div>
          <div>
            <input
              className="commands-list-name"
              type="number"
              value={privilege}
              onChange={(e) => {
                setPrivilege(Number(e.target.value));
                changeColorOnChange(e);
              }}
            />
          </div>

          <div>Description </div>
          <div>
            <textarea
              className="commands-textarea"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                changeColorOnChange(e);
              }}
            />
          </div>

          <div>Aliases </div>
          <div>
            <textarea
              className="commands-textarea"
              value={aliases?.join("\n")}
              onChange={(e) => {
                setAliases(e.target.value?.split("\n"));
                changeColorOnChange(e);
              }}
            />
          </div>

          <div>Messages </div>
          <div>
            <textarea
              className="commands-textarea"
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
