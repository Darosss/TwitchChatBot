import "./style.css";

import React, { useContext, useEffect, useState } from "react";
import formatDate from "@utils/formatDate";
import FilterBarCommands from "./filterBarCommands";
import ChatCommandService from "@services/ChatCommandService";
import Modal from "@components/modal";
import Pagination from "@components/pagination";
import PreviousPage from "@components/previousPage";
import { SocketContext } from "@context/SocketContext";

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
  const [privilege, setPrivilege] = useState<number>();

  const {
    data: commandsData,
    loading,
    error,
    refetchData,
  } = ChatCommandService.getCommands();

  const socketRefreshTrigger = () => {
    socket?.emit("refreshCommands");
  };
  useEffect(() => {
    if (
      commandIdDelete !== null &&
      confirm(`Are you sure you want to delete command: ${commandIdDelete}?`)
    ) {
      fetchDeleteCommand().then(() => {
        socketRefreshTrigger();
        refetchData();
        setCommandIdDelete(null);
      });
    } else {
      setCommandIdDelete(null);
    }
  }, [commandIdDelete]);

  const { refetchData: fetchEditComman } = ChatCommandService.editCommand(
    editingCommand,
    {
      name: name,
      description: description,
      enabled: enabled,
      aliases: aliases,
      messages: messages,
      privilege: privilege || 0,
    }
  );

  const { error: createCommandError, refetchData: fetchCreateCommand } =
    ChatCommandService.createCommand({
      name: `New command${commandsData?.count}`,
      description: `New command description${commandsData?.count}`,
      enabled: true,
      aliases: [`New command${commandsData?.count} default alias`],
      messages: [`New command${commandsData?.count} default message`],
      privilege: 0,
    });

  const { refetchData: fetchDeleteCommand } = ChatCommandService.deleteCommand(
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
    });
    resetOnChangeClasses();
    setShowModal(false);
  };

  const onCloseModal = () => {
    setShowModal(false);
    resetOnChangeClasses();
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
              <th>Name</th>
              <th>Created</th>
              <th>Uses</th>
              <th>Enabled</th>
              <th>Privilege</th>
              <th>Description</th>
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
                      onClick={() => {
                        setEditingCommand(command._id);
                        setName(command.name);
                        setDescription(command.description || "");
                        setAliases(command.aliases);
                        setMessages(command.messages);
                        setPrivilege(command.privilege);
                        setEnabled(command.enabled);
                        setShowModal(true);
                      }}
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
                  <td> {command.name} </td>
                  <td>
                    <div className="tooltip">
                      {formatDate(command.createdAt, "days+time")}
                      <span className="tooltiptext">
                        {formatDate(command.createdAt)}
                      </span>
                    </div>
                  </td>

                  <td>{command.useCount}</td>
                  <td>{command.enabled.toString()}</td>
                  <td>{command.privilege.toString()}</td>
                  <td className="commands-big">{command.description}</td>

                  <td className="commands-big">{command.aliases.join("\n")}</td>
                  <td className="commands-big">
                    {command.messages.join("\n")}
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
        <table className="commands-list-modal-wrapper">
          <tbody>
            <tr>
              <th>Name </th>
              <td>
                <input
                  className="commands-list-name"
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
                  onClick={(e) => toggleOnOffCommand(e)}
                  className={
                    `${!true ? "danger-button" : "primary-button"} ` +
                    "common-button"
                  }
                >
                  {enabled.toString()}
                </button>
              </td>
            </tr>
            <tr>
              <th>Privilege</th>
              <td>
                <input
                  className="commands-list-name"
                  type="number"
                  defaultValue={privilege}
                  onChange={(e) => {
                    setPrivilege(Number(e.target.value));
                    changeColorOnChange(e);
                  }}
                />
              </td>
            </tr>
            <tr>
              <th>Description </th>
              <td>
                <textarea
                  className="commands-textarea"
                  defaultValue={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    changeColorOnChange(e);
                  }}
                />
              </td>
            </tr>
            <tr>
              <th>Aliases </th>
              <td>
                <textarea
                  className="commands-textarea"
                  defaultValue={aliases?.join("\n")}
                  onChange={(e) => {
                    setAliases(e.target.value?.split("\n"));
                    changeColorOnChange(e);
                  }}
                />
              </td>
            </tr>
            <tr>
              <th>Messages </th>
              <td>
                <textarea
                  className="commands-textarea"
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
