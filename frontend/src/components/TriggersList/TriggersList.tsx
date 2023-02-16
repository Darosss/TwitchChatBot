import React, { useState } from "react";
import "./style.css";
import { ITrigger } from "@backend/models/types/";
import Pagination from "@components/Pagination";
import useAxios from "axios-hooks";
import { AxiosRequestConfig } from "axios";
import Modal from "@components/Modal";
import formatDate from "@utils/formatDate";
import PreviousPage from "@components/PreviousPage";
import FilterBarTriggers from "./FilterBarTriggers";
import { useSearchParams } from "react-router-dom";

interface ITriggerRes {
  triggers: ITrigger[];
  totalPages: number;
  count: number;
  currentPage: number;
}

export default function TriggersList() {
  const [searchParams] = useSearchParams();

  const [showModal, setShowModal] = useState(false);

  const [editingTrigger, setEditingTrigger] = useState("");

  const [name, setName] = useState("");
  const [chance, setChance] = useState<number>();
  const [enabled, setEnabled] = useState(true);
  const [delay, setDelay] = useState<number>();
  const [messages, setMessages] = useState([""]);
  const [words, setWords] = useState([""]);

  const [{ data, loading, error }, refetchTriggers] = useAxios<ITriggerRes>(
    `/triggers?${searchParams}`
  );

  const [{}, postTrigger] = useAxios<{
    message: string;
  }>(
    {
      method: "POST",
    } as AxiosRequestConfig,
    { manual: true }
  );

  if (error) return <>There is an error. {error.response?.data.message}</>;
  if (loading || !data) return <> Loading...</>;

  const { triggers, count, currentPage } = data;

  const removeTrigger = (id: string) => {
    if (confirm(`Are you sure you want delete trigger: }`))
      postTrigger({
        url: `/triggers/delete/${id}`,
        method: "DELETE",
      } as AxiosRequestConfig).then(() => {
        refetchTriggers();
      });
  };

  const createNewTrigger = () => {
    postTrigger({
      url: `/triggers/create`,
      method: "POST",
      data: {
        name: `New trigger${count}`,
        delay: 180,
        enabled: true,
        chance: chance,
        words: [`New trigger${count} default word`],
        messages: [`New trigger${count} default message`],
      },
    } as AxiosRequestConfig).then(() => {
      refetchTriggers();
    });
  };

  const editTrigger = () => {
    postTrigger({
      url: `/triggers/${editingTrigger}`,
      method: "POST",
      data: {
        name: name,
        description: chance,
        enabled: enabled,
        chance: chance,
        delay: delay,
        messages: messages,
        words: words,
      },
    } as AxiosRequestConfig).then(() => {
      refetchTriggers();
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
            {triggers.map((trigger) => {
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
                      onClick={(e) => removeTrigger(trigger._id)}
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
        onClose={() => {
          setShowModal(false);
          resetOnChangeClasses();
        }}
        onSubmit={() => {
          editTrigger();
          resetOnChangeClasses();
          setShowModal(false);
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
