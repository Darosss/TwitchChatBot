import React, { useEffect, useState } from "react";
import "./style.css";
import useAxios from "axios-hooks";

import PreviousPage from "@components/PreviousPage";
import Message from "@components/Message";
import { useParams, Link } from "react-router-dom";
import { IMessage, IUser } from "@backend/models/types";
import formatDate from "@utils/formatDate";
import { AxiosRequestConfig } from "axios";

export default function UserProfile() {
  const { userId } = useParams();
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notes, setNotes] = useState("");

  const [, executePost] = useAxios(
    {
      url: `/users/${userId}`,
      method: "POST",
    } as AxiosRequestConfig,
    { manual: true }
  );

  const [{ data: msgsData, error: msgsError, loading: msgsLoading }] =
    useAxios<{ firstMessages: IMessage[]; latestMessages: IMessage[] }>({
      url: `/messages/${userId}/latest-first-msgs`,
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

  const [{ data: userData, loading: userLoading, error: userError }] =
    useAxios<IUser>(`/users/${userId}`);

  useEffect(() => {
    setNotes(userData?.notes?.join("\n") || "");
  }, [userData]);

  if (msgsLoading || userLoading) return <p> Loading </p>;
  if (userError || msgsError) return <p>There is an error.</p>;
  if (!userData || !msgsData) return <p>Someting went wrong</p>;
  console.log(userData);
  return (
    <>
      <PreviousPage />

      <table className="profile-details">
        <tbody>
          <tr>
            <td>
              <Link className="user-details-btn" to={`../messages/${userId}`}>
                Messages
              </Link>

              <Link
                className="user-details-btn"
                to={`../redemptions/${userId}`}
              >
                Redemptions
              </Link>
            </td>
          </tr>
          <tr>
            <th>Username</th>
            <td>{userData.username}</td>
            <th>Display name</th>
            <td>{userData.userDisplayName}</td>
          </tr>
          <tr>
            <th>Messages</th>
            <td>{userData.messageCount.toLocaleString()}</td>
            <th>Points</th>
            <td>{userData.points.toLocaleString()}</td>
          </tr>
          <tr>
            <th>Created</th>
            <td>{formatDate(userData.createdAt)}</td>
            <th>Follower</th>
            <td colSpan={3}>
              {userData.follower ? formatDate(userData.follower) : "False"}
            </td>
          </tr>
          <tr>
            <th className="profile-details-notes">
              Notes
              <button
                onClick={showEdit}
                className="user-details-btn float-right"
              >
                Edit
              </button>
            </th>
            <td colSpan={5}>
              {!isEditingNotes ? (
                <ul className="notes-list">
                  {userData.notes?.map((note, ind) => {
                    return <li key={ind}>{note}</li>;
                  })}
                </ul>
              ) : (
                <>
                  <textarea
                    className="textarea-edit"
                    defaultValue={userData.notes?.join("\n")}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                  <button
                    className="user-details-btn"
                    style={{ width: "20vw" }}
                    onClick={saveNote}
                  >
                    Save
                  </button>
                </>
              )}
            </td>
          </tr>
          <tr>
            <th>
              First / Last <br /> Messages
            </th>
            <td colSpan={5}>
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
            </td>
          </tr>
          <tr>
            <th>Zjeb</th>
            <td colSpan={3}>soon</td>
          </tr>
          <tr>
            <th>Times seen</th>
            <td colSpan={3}>soon</td>
          </tr>
          <tr>
            <th>Categories</th>
            <td colSpan={3}>soon</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
