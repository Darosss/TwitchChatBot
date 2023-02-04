import React, { useState } from "react";
import "./style.css";
import { IChatCommand } from "@backend/models/types/";
import Pagination from "@components/Pagination";
import useAxios from "axios-hooks";
import { AxiosRequestConfig } from "axios";
import Modal from "@components/Modal";
import formatDate from "@utils/formatDate";

interface IChatCommandRes {
  chatCommands: IChatCommand[];
  totalPages: number;
  count: number;
  currentPage: number;
}

export default function CommandsList() {
  const [currentPageLoc, setCurrentPageLoc] = useState(1);

  const [pageSize, setPageSize] = useState(
    Number(localStorage.getItem("commandsListPageSize")) || 15
  );

  const [showModal, setShowModal] = useState(false);

  const [editingCommand, setEditingCommand] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [enabled, setEnabled] = useState(true);
  const [aliases, setAliases] = useState([""]);
  const [messages, setMessages] = useState([""]);
  const [privilege, setPrivilege] = useState<number>();

  const [{ data, loading, error }, refetchCommands] = useAxios<IChatCommandRes>(
    `/chat-commands?page=${currentPageLoc}&limit=${pageSize}`
  );

  const [{}, postChatCommand] = useAxios<{
    message: string;
  }>(
    {
      method: "POST",
    } as AxiosRequestConfig,
    { manual: true }
  );

  if (error) return <>There is an error. {error.response?.data.message}</>;
  if (loading || !data) return <> Loading...</>;

  const { chatCommands, count, currentPage } = data;

  const removeCommand = (id: string) => {
    if (confirm(`Are you sure you want delete command: }`))
      postChatCommand({
        url: `/chat-commands/delete/${id}`,
        method: "DELETE",
      } as AxiosRequestConfig).then(() => {
        refetchCommands();
      });
  };

  const createNewCommand = () => {
    postChatCommand({
      url: `/chat-commands/create`,
      method: "POST",
      data: {
        name: `New command${count}`,
        description: `New command description${count}`,
        enabled: true,
        aliases: [`New command${count} default alias`],
        messages: [`New command${count} default message`],
        privilege: 0,
      },
    } as AxiosRequestConfig).then(() => {
      refetchCommands();
    });
  };

  const editCommand = () => {
    postChatCommand({
      url: `/chat-commands/${editingCommand}`,
      method: "POST",
      data: {
        name: name,
        description: description,
        enabled: enabled,
        aliases: aliases,
        messages: messages,
        privilege: privilege,
      },
    } as AxiosRequestConfig).then(() => {
      refetchCommands();
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

  return (
    <>
      <div id="commands-list" className="table-list-wrapper">
        <table id="table-commands-list">
          <thead>
            <tr>
              <th>
                Actions
                <button
                  className="create-command command-list-button"
                  onClick={(e) => createNewCommand()}
                >
                  New
                </button>
              </th>
              <th>Name</th>
              <th>Created</th>
              <th>Uses</th>
              <th>Enabled</th>
              <th>Privilage</th>
              <th>Description</th>
              <th>Aliases</th>
              <th>Messages</th>
            </tr>
          </thead>

          <tbody>
            {chatCommands.map((command) => {
              return (
                <tr key={command._id}>
                  <td>
                    <button
                      className="command-action command-list-button"
                      onClick={() => {
                        setEditingCommand(command._id);
                        setName(command.name);
                        setDescription(command.description || "");
                        setAliases(command.aliases);
                        setMessages(command.messages);
                        setPrivilege(command.privilage);
                        setEnabled(command.enabled);
                        setShowModal(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="command-action command-list-button command-delete"
                      onClick={(e) => removeCommand(command._id)}
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
                  <td>{command.privilage.toString()}</td>
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
          pageSize={pageSize}
          onPageSizeChange={(pageSize) => setPageSize(pageSize)}
          onPageChange={(page) => setCurrentPageLoc(page)}
          siblingCount={1}
        />
      </div>
      <Modal
        title="Edit command"
        onClose={() => {
          setShowModal(false);
          resetOnChangeClasses();
        }}
        onSubmit={() => {
          editCommand();
          resetOnChangeClasses();
          setShowModal(false);
        }}
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
                    `${!true ? "command-disabled" : ""} ` +
                    "command-list-button"
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
