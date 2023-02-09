import "./style.css";
import React, { useContext, useEffect, useReducer, useState } from "react";

import { SocketContext } from "@context/SocketContext";
import formatDate from "@utils/formatDate";
import { Link } from "react-router-dom";
import { IEventAndIUser } from "@libs/types";

export default function TwitchNotifications(props: { className?: string }) {
  const LIMIT_NOTIFICATIONS = 5;
  const { className } = props;

  const socket = useContext(SocketContext);

  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const [userNotif, setUserNotif] = useState<IEventAndIUser[]>([]);

  const removeParentElement = (
    e: React.MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    (e.target as HTMLButtonElement).parentElement?.remove();
  };

  useEffect(() => {
    socket?.on("userJoinTwitchChat", (event, user) => {
      setUserNotif((prevState) => {
        prevState.unshift(Object.assign(user, event) as IEventAndIUser);
        return prevState;
      });

      if (userNotif?.length > LIMIT_NOTIFICATIONS) {
        setUserNotif((prevState) => {
          prevState.pop();
          return prevState;
        });
      }
      forceUpdate();
    });

    return () => {
      socket.off("userJoinTwitchChat");
    };
  }, [socket]);

  return (
    <div
      id="twitch-notifications"
      className={`twitch-notifications ${className ? className : ""}`}
    >
      {userNotif.map((notif) => {
        return (
          <div
            className={`user-info ${
              Math.floor(
                new Date(notif.eventDate).getTime() / 1000 -
                  new Date(notif.createdAt).getTime() / 1000
              ) < 1200
                ? "new-user"
                : "usual"
            } `}
            key={notif._id}
          >
            <button
              id="button-close"
              onClick={(e) => {
                removeParentElement(e);
              }}
            >
              X
            </button>
            <div className="user-info-event">{notif.eventName}</div>
            <div className="user-info-date">
              {formatDate(notif.eventDate, "time")}
            </div>
            <div className="user-info-username">
              <Link to={`../user/${notif._id}`} target="_blank">
                {notif.username}
              </Link>
            </div>
            <div className="user-info-messages">
              <img
                src="/icons/message.png"
                alt="msg"
                className="user-info-icon"
              />
              :<span>{notif.messageCount.toLocaleString()}</span>
            </div>

            <div className="user-info-points">
              <img
                src="/icons/finger.png"
                alt="points"
                className="user-info-icon"
              />
              : <span>{notif.points.toLocaleString()}</span>
            </div>
            <div className="user-info-created-date">
              <img
                src="/icons/calendar.png"
                alt="created"
                className="user-info-icon"
              />
              :<span> {formatDate(notif.createdAt, "days+time")}</span>
            </div>
            <div className="user-info-last-seen">
              <img
                src="/icons/eyes.png"
                alt="seen"
                className="user-info-icon"
              />
              : <span>{formatDate(notif.lastSeen, "days+time")}</span>
            </div>
            <div className="user-info-follower">
              <img
                src="/icons/heart.png"
                alt="follow"
                className="user-info-icon"
              />
              :
              {notif.follower ? (
                <span>{formatDate(notif.follower, "days+time")}</span>
              ) : (
                <span>No</span>
              )}
            </div>
            <div className="user-info-subsriber">
              <img src="/icons/star.png" alt="sub" className="user-info-icon" />
              <span> 2020-20-20</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
