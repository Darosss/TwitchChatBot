import "./style.css";

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Message from "@components/message";
import PreviousPage from "@components/previousPage";
import { editUser, getLatestEldestMsgs, getUser } from "@services/UserService";
import { addNotification } from "@utils/getNotificationValues";
import { DateTooltip } from "@components/dateTooltip";

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
      addNotification("Success", "User edited successfully", "success");
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
            <div>
              <DateTooltip date={data.createdAt} />
            </div>
          </div>
          <div className="nested-detail">
            <div>Last seen:</div>
            <div>
              {data.lastSeen ? <DateTooltip date={data.lastSeen} /> : null}
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
              {data.twitchCreated ? (
                <DateTooltip date={data.twitchCreated} />
              ) : null}
            </div>
          </div>
          <div className="nested-detail">
            <div>Follow:</div>
            <div>
              {data.follower ? <DateTooltip date={data.follower} /> : null}
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
            <div>{data.points?.toFixed(0)}</div>
          </div>
        </div>
        <div className="notes-details small-details large">
          <div className="nested-detail">
            <div>
              <ul>
                <li className="edit-notes-btn-list">
                  <button
                    onClick={showEdit}
                    className="common-button primary-button"
                  >
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
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
              <button
                className="common-button danger-button user-save-profile"
                onClick={saveNote}
              >
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
