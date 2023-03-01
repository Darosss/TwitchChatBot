import "./style.css";

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import formatDate from "@utils/formatDate";
import Message from "@components/message";
import PreviousPage from "@components/previousPage";
import { editUser, getLatestEldestMsgs, getUser } from "@services/UserService";

export default function UserProfile() {
  const { userId } = useParams();
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notes, setNotes] = useState("");

  const { data: userData, loading, error, refetchData } = getUser(userId || "");

  const { refetchData: fetchEditUser } = editUser(userId || "", {
    notes: notes.split("\n"),
  });

  const {
    data: msgsData,
    loading: msgLoading,
    error: msgsError,
    refetchData: refetchLatestAndFirstMsgs,
  } = getLatestEldestMsgs(userId || "");

  const showEdit = () => {
    setIsEditingNotes((prevState) => {
      return !prevState;
    });
  };

  const saveNote = () => {
    fetchEditUser().then(() => {
      refetchData();
      setIsEditingNotes(false);
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
  const { data } = userData;
  return (
    <>
      <PreviousPage />
      <div className="profile-details-wrapper">
        <div className="user-details small-details small">
          <div className="nested-detail">
            <div>Username:</div> <div>{data.username}</div>
          </div>
          <div className="nested-detail">
            <div>First seen:</div>
            <div>{formatDate(data.createdAt, "days+time")}</div>
          </div>
          <div className="nested-detail">
            <div>Last seen:</div>
            <div>
              {data.lastSeen ? formatDate(data.lastSeen, "days+time") : null}
            </div>
          </div>
        </div>
        <div className="twitch-details small-details small">
          <div className="nested-detail">
            <div>Twitch name:</div> <div>{data.twitchName}</div>
          </div>
          <div className="nested-detail">
            <div>Twitch created:</div>
            <div>
              {data.twitchCreated
                ? formatDate(data.twitchCreated, "days+time")
                : null}
            </div>
          </div>
          <div className="nested-detail">
            <div>Follow:</div>
            <div>
              {data.follower ? formatDate(data.follower, "days+time") : null}
            </div>
          </div>
        </div>
        <div className="messages-points-details small-details small">
          <div className="nested-detail">
            <div>Messages:</div>
            <div>{data.messageCount}</div>
          </div>
          <div className="nested-detail">
            <div>Points:</div>
            <div>{data.points}</div>
          </div>
        </div>
        <div className="notes-details small-details large">
          <div className="nested-detail">
            <div>
              <ul>
                <li className="edit-notes-btn-list">
                  <button onClick={showEdit} className="user-details-btn">
                    Edit
                  </button>
                </li>
                {data.notes?.map((note, index) => {
                  return <li key={index}>{note}</li>;
                })}
              </ul>
            </div>
          </div>
        </div>
        <div className="latest-messages-details large-details">
          <div className="profile-user-messages">
            <div className="profile-first-messages profile-user-messages-inner">
              <div className="profile-messages-header"> First messages</div>
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
              <div className="profile-messages-header"> Latest messages</div>
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
        </div>
        {isEditingNotes ? (
          <div className="notes-graphs-details large-details">
            <div className="nested-detail">
              <textarea
                className="textarea-edit"
                defaultValue={userData.data.notes?.join("\n")}
                onChange={(e) => setNotes(e.target.value)}
              />
              <button className="user-details-btn small" onClick={saveNote}>
                Save
              </button>
            </div>
            <div className="nested-detail"></div>
          </div>
        ) : null}
        <div
          className={`${
            isEditingNotes ? "graphs-details" : "notes-graphs-details"
          } large-details`}
        >
          GRAPHS
        </div>
      </div>
    </>
  );
}
