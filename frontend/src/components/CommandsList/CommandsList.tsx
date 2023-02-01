import React, { useEffect, useReducer, useState } from "react";
import "./style.css";
import { IChatCommand } from "@backend/models/types/";
import Pagination from "@components/Pagination";
import useAxios from "axios-hooks";
import { AxiosRequestConfig } from "axios";

interface IChatCommandRes {
  chatCommands: IChatCommand[];
  totalPages: number;
  count: number;
  currentPage: number;
}

export default function CommandsList() {
  const [currentPageLoc, setCurrentPageLoc] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const [name, setName] = useState(new Map<string, string>());
  const [description, setDescription] = useState(new Map<string, string>());
  const [enabled, setEnabled] = useState(new Map<string, boolean>());
  const [aliases, setAliases] = useState(new Map<string, string[]>());
  const [messages, setMessages] = useState(new Map<string, string[]>());
  const [privilege, setPrivilege] = useState(new Map<string, number>());

  const [{ data, loading, error }] = useAxios<IChatCommandRes>(
    `/chat-commands?page=${currentPageLoc}&limit=${pageSize}&`
  );

  const [{}, postChatCommand] = useAxios<{
    message: string;
  }>(
    {
      method: "POST",
    } as AxiosRequestConfig,
    { manual: true }
  );

  useEffect(() => {
    data?.chatCommands.forEach((command) => {
      setName((prevState) => {
        prevState.set(command._id, command.name);
        return prevState;
      });
      setDescription((prevState) => {
        return prevState.set(command._id, command.description || "");
      });
      setEnabled((prevState) => {
        prevState.set(command._id, command.enabled);
        return prevState;
      });
      setAliases((prevState) => {
        return prevState.set(command._id, command.aliases);
      });
      setMessages((prevState) => {
        return prevState.set(command._id, command.messages);
      });
      setPrivilege((prevState) => {
        return prevState.set(command._id, command.privilage);
      });

      forceUpdate();
    });
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>There is an error.</p>;
  if (!data) return <p>Loading...</p>;

  const { chatCommands, count, currentPage } = data;

  const removeCommand = (id: string) => {
    if (confirm(`Are you sure you want delete command: ${name.get(id)}`))
      postChatCommand({
        url: `/chat-commands/delete/${id}`,
        method: "DELETE",
      } as AxiosRequestConfig).then(() => {
        setTimeout(() => {
          window.location.reload();
        }, 500);
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
      setTimeout(() => {
        window.location.reload();
      }, 500);
    });
  };

  const editCommand = (id: string) => {
    postChatCommand({
      url: `/chat-commands/${id}`,
      method: "POST",
      data: {
        name: name.get(id),
        description: description.get(id),
        enabled: enabled.get(id),
        aliases: aliases.get(id),
        messages: messages.get(id),
        privilege: privilege.get(id),
      },
    } as AxiosRequestConfig).then(() => {
      setTimeout(() => {
        window.location.reload();
      }, 500);
    });
  };

  const toggleOnOffCommand = (commandId: string) => {
    setEnabled((prevState) => {
      const prevBoolean = prevState.get(commandId);

      prevState.set(commandId, !prevBoolean);

      return prevState;
    });

    forceUpdate();
  };

  const createRadioPrivileges = (_id: string, checked: number) => {
    const setPrivilageState = (value: number) => {
      setPrivilege((prevState) => {
        prevState.set(_id, Number(value));
        return prevState;
      });

      console.log(privilege);
    };

    let radioHTML = [];
    for (let i = 0; i <= 10; i++) {
      radioHTML.push(
        <label key={"radioPrivilege" + i}>
          {i}
          {checked === i ? (
            <input
              type="radio"
              onChange={(e) => setPrivilageState(Number(e.target.value))}
              name={_id}
              defaultChecked
              value={i}
            />
          ) : (
            <input
              type="radio"
              name={_id}
              onChange={(e) => setPrivilageState(Number(e.target.value))}
              value={i}
            />
          )}
        </label>
      );
    }

    return radioHTML;
  };

  return (
    <>
      <div id="commands-list">
        <table id="table-commands-list">
          <thead>
            <tr>
              <th>
                <button
                  className="create-command"
                  onClick={(e) => createNewCommand()}
                >
                  New
                </button>
                Name
              </th>
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
                      className="command-action"
                      onClick={(e) => editCommand(command._id)}
                    >
                      Edit
                    </button>
                    <input
                      className="commands-list-name"
                      type="text"
                      defaultValue={name.get(command._id)}
                      onChange={(e) =>
                        setName((prevState) => {
                          prevState.set(command._id, e.target.value);
                          return prevState;
                        })
                      }
                    />
                    <button
                      className="command-action command-delete"
                      onClick={(e) => removeCommand(command._id)}
                    >
                      Delete
                    </button>
                  </td>

                  <td className="commands-text">{command.useCount}</td>
                  <td>
                    <button onClick={(e) => toggleOnOffCommand(command._id)}>
                      {enabled.get(command._id)?.toString()}
                    </button>
                  </td>
                  <td className="commands-td-radio">
                    {createRadioPrivileges(command._id, command.privilage)}
                  </td>
                  <td>
                    <textarea
                      className="commands-textarea"
                      defaultValue={description.get(command._id)}
                      onChange={(e) =>
                        setDescription((prevState) => {
                          return prevState.set(command._id, e.target.value);
                        })
                      }
                    ></textarea>
                  </td>

                  <td>
                    <textarea
                      className="commands-textarea"
                      defaultValue={aliases.get(command._id)?.join("\n")}
                      onChange={(e) =>
                        setAliases((prevState) => {
                          return prevState.set(
                            command._id,
                            e.target.value?.split("\n")
                          );
                        })
                      }
                    ></textarea>
                  </td>
                  <td>
                    <textarea
                      className="commands-textarea commands-messages-textarea"
                      defaultValue={messages.get(command._id)?.join("\n")}
                      onChange={(e) =>
                        setMessages((prevState) => {
                          return prevState.set(
                            command._id,
                            e.target.value?.split("\n")
                          );
                        })
                      }
                    ></textarea>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="pagination">
        <Pagination
          className="pagination-bar"
          currentPage={currentPage}
          totalCount={count}
          pageSize={pageSize}
          onPageSizeChange={(pageSize) => setPageSize(pageSize)}
          onPageChange={(page) => setCurrentPageLoc(page)}
          siblingCount={1}
        />
      </div>
    </>
  );
}
