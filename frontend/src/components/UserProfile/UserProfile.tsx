import React, { useEffect, useState } from "react";
import "./style.css";

import PreviousPage from "@components/PreviousPage";
import Message from "@components/Message";
import { useParams, Link } from "react-router-dom";
import formatDate from "@utils/formatDate";
import UserService from "src/services/User.service";
import MessageService from "src/services/Message.service";

export default function UserProfile() {
  const { userId } = useParams();
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notes, setNotes] = useState("");

  const {
    data: userData,
    loading,
    error,
    refetchData,
  } = UserService.getUser(userId || "");

  const { refetchData: fetchEditUser } = UserService.editUser(userId || "", {
    notes: notes.split("\n"),
  });

  const {
    data: msgsData,
    loading: msgLoading,
    error: msgsError,
    refetchData: refetchLatestAndFirstMsgs,
  } = MessageService.getLatestAndFirstMsgs(userId || "");

  const showEdit = () => {
    setIsEditingNotes((prevState) => {
      return !prevState;
    });
  };

  const saveNote = () => {
    fetchEditUser().then(() => {
      refetchData();
    });
  };

  useEffect(() => {
    setNotes(userData?.data.notes?.join("\n") || "");
  }, [userData]);

  if (error || msgsError)
    return (
      <>
        There is an error. {error?.response?.data.message}
        {msgsError?.response?.data.message}
      </>
    );
  if (!userData || !msgsData || msgLoading || loading) return <>Loading</>;

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
            <td>{userData.data.username}</td>
            <th>Display name</th>
            <td>{userData.data.userDisplayName}</td>
          </tr>
          <tr>
            <th>Messages</th>
            <td>{userData.data.messageCount?.toLocaleString() || "0"}</td>
            <th>Points</th>
            <td>{userData.data.points?.toLocaleString() || ""}</td>
          </tr>
          <tr>
            <th>Created</th>
            <td>
              <div className="tooltip">
                {formatDate(userData.data.createdAt, "days+time")}
                <span className="tooltiptext">
                  {formatDate(userData.data.createdAt)}
                </span>
              </div>
            </td>
            <th>Follower</th>
            <td colSpan={3}>
              {userData.data.follower ? (
                <div className="tooltip">
                  {formatDate(userData.data.follower, "days+time")}
                  <span className="tooltiptext">
                    {formatDate(userData.data.follower)}
                  </span>
                </div>
              ) : (
                "False"
              )}
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
                  {userData.data.notes?.map((note, ind) => {
                    return <li key={ind}>{note}</li>;
                  })}
                </ul>
              ) : (
                <>
                  <textarea
                    className="textarea-edit"
                    defaultValue={userData.data.notes?.join("\n")}
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
                  {msgsData.data.firstMessages.map((msg) => {
                    return (
                      <Message
                        key={msg._id}
                        date={msg.date}
                        username={msg.owner.username}
                        message={msg.message}
                      />
                    );
                  })}
                </div>
                <div className="profile-last-messages profile-user-messages-inner">
                  {msgsData.data.latestMessages.map((msg) => {
                    return (
                      <Message
                        key={msg._id}
                        date={msg.date}
                        username={msg.owner.username}
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
