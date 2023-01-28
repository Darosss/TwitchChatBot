import React, { useEffect, useState } from "react";
import "./style.css";
import useAxios from "axios-hooks";
import PreviousPage from "../PreviousPage";
import { useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch.hook";
import { IMessage, IUser } from "@backend/models/types";
import formatDate from "../../utils/formatDate";
import { AxiosRequestConfig } from "axios";
import Message from "../Message";

export default function UserProfile() {
  const { userId } = useParams();
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notes, setNotes] = useState("");

  const [{ data: postData, error: postError }, executePost] = useAxios(
    {
      url: `${process.env.REACT_APP_BACKEND_URL}/users/${userId}`,
      method: "POST",
    } as AxiosRequestConfig,
    { manual: true }
  );

  const [{ data: msgsData, error: msgsError, loading: msgsLoading }] =
    useAxios<{ firstMessages: IMessage[]; latestMessages: IMessage[] }>({
      url: `${process.env.REACT_APP_BACKEND_URL}/messages/${userId}/latest-first-msgs`,
      method: "GET",
    } as AxiosRequestConfig);

  const showEdit = () => {
    setIsEditingNotes((prevState) => {
      return !prevState;
    });
  };

  const saveNote = () => {
    executePost({
      data: { notes: notes.split("\n") },
    } as AxiosRequestConfig).then(() => {
      setTimeout(() => {
        window.location.reload();
      }, 500);
    });
  };

  const { data, error } = useFetch<IUser>(
    `${process.env.REACT_APP_BACKEND_URL}/users/${userId}`
  );

  useEffect(() => {
    setNotes(data?.notes?.join("\n") || "");
  }, [data]);

  if (error || msgsError) return <p>There is an error.</p>;
  if (!data || !msgsData) return <p>Loading...</p>;

  return (
    <>
      <PreviousPage />
      <button className="user-messages-btn">
        <a href={`../messages/${userId}`}>User messages</a>
      </button>
      <button className="user-messages-btn">
        <a href={`../redemptions/${userId}`}>User redemptions</a>
      </button>
      <table className="profile-details">
        <tbody>
          <tr>
            <td>Username:</td>
            <td>{data.username}</td>
          </tr>
          <tr>
            <td>
              Notes:
              <button onClick={showEdit} className="profile-btn-edit">
                Edit
              </button>
            </td>
            <td>
              {!isEditingNotes ? (
                <ul className="notes-list">
                  {data.notes?.map((note, ind) => {
                    return <li key={ind}>{note}</li>;
                  })}
                </ul>
              ) : (
                <>
                  <textarea
                    className="textarea-edit"
                    defaultValue={data.notes?.join("\n")}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                  <button className="profile-btn-edit" onClick={saveNote}>
                    Save
                  </button>
                </>
              )}
            </td>
          </tr>
          <tr>
            <td>Created:</td>
            <td>{formatDate(data.createdAt)}</td>
          </tr>
          <tr>
            <td>Points:</td>
            <td>{data.points.toLocaleString()}</td>
          </tr>
          <tr>
            <td>Messages count:</td>
            <td>{data.messageCount.toLocaleString()}</td>
          </tr>
          <tr>
            <td>Messages:</td>
            <td>
              <div className="profile-user-messages">
                <div className="profile-first-messages profile-user-messages-inner">
                  {msgsData.firstMessages.map((msg) => {
                    return (
                      <Message
                        key={msg._id}
                        date={msg.date}
                        username={(msg.owner as IUser).username}
                        message={msg.message}
                      />
                    );
                  })}
                </div>
                <div className="profile-last-messages profile-user-messages-inner">
                  {msgsData.latestMessages.map((msg) => {
                    return (
                      <Message
                        key={msg._id}
                        date={msg.date}
                        username={(msg.owner as IUser).username}
                        message={msg.message}
                      />
                    );
                  })}
                </div>
              </div>
              {/* <table className="user-last-first-messages">
                <tbody>
                  <tr>
                    <td>first message 1</td>
                    <td> last message 1</td>
                  </tr>
                  <tr>
                    <td>first message 2</td>
                    <td>last message 2</td>
                  </tr>
                </tbody>
              </table> */}
            </td>
          </tr>
          <tr>
            <td>Categories:</td>
            <td>soon</td>
          </tr>
          <tr>
            <td>Times seen:</td>
            <td>soon</td>
          </tr>
          <tr>
            <td>Most used word:</td>
            <td>soon</td>
          </tr>
          <tr>
            <td>Zjeb:</td>
            <td>soon</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
