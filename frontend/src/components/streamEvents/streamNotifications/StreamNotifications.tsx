import React, { useContext, useEffect, useReducer, useState } from "react";

import { SocketContext } from "@context/SocketContext";
import { Link } from "react-router-dom";
import { EventAndIUser } from "@libs/types";
import { DateTooltip } from "@components/dateTooltip";
import moment from "moment";

export default function StreamNotifications() {
  const LIMIT_NOTIFICATIONS = 5;

  const socket = useContext(SocketContext);

  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const [userNotif, setUserNotif] = useState<EventAndIUser[]>([]);

  const removeParentElement = (
    e: React.MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    (e.target as HTMLButtonElement).parentElement?.remove();
  };

  useEffect(() => {
    socket?.on("userJoinTwitchChat", (event, user) => {
      setUserNotif((prevState) => {
        prevState.unshift(Object.assign(user, event) as EventAndIUser);
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
    <div id="stream-notifications" className={`stream-notifications`}>
      {userNotif.map((notif, index) => {
        return (
          <div
            className={`user-info ${
              notif.eventName === "Left chat" ? "left-chat" : ""
            } ${
              Math.floor(
                new Date(notif.eventDate).getTime() / 1000 -
                  new Date(notif.createdAt).getTime() / 1000
              ) < 1200
                ? "new-user"
                : "usual"
            } `}
            key={index}
          >
            <div className="user-info-event-data-wrapper">
              <div className="user-info-username">
                <Link to={`/users/${notif._id}`} target="_blank">
                  {notif.username}
                </Link>
              </div>
              <div className="user-info-event">{notif.eventName}</div>
              <div className="user-info-date">
                {moment(notif.eventDate).fromNow()}
              </div>
            </div>

            <div className="user-info-user-data-wrapper">
              <div className="user-info-messages">
                <div>
                  <img
                    src="/icons/message.png"
                    alt="msg"
                    className="user-info-icon"
                  />
                </div>
                <div>{notif.messageCount?.toLocaleString()}</div>
              </div>

              <div className="user-info-points">
                <div>
                  <img
                    src="/icons/finger.png"
                    alt="points"
                    className="user-info-icon"
                  />
                </div>
                <div>{notif.points?.toLocaleString()}</div>
              </div>

              {/* <div className="user-info-subsriber">
                <div>
                  <img
                    src="/icons/star.png"
                    alt="sub"
                    className="user-info-icon"
                  />
                </div>
                <div> 2020-20-20</div>
              </div> */}
            </div>

            <div className="user-info-user-dates-wrapper">
              <div className="user-info-created-date">
                <div>
                  <img
                    src="/icons/calendar.png"
                    alt="created"
                    className="user-info-icon"
                  />
                </div>
                <div>
                  <DateTooltip date={notif.createdAt} />
                </div>
              </div>
              <div className="user-info-last-seen">
                <div>
                  <img
                    src="/icons/eyes.png"
                    alt="seen"
                    className="user-info-icon"
                  />
                </div>

                <div>
                  {notif.lastSeen ? (
                    <DateTooltip date={notif.lastSeen} />
                  ) : null}
                </div>
              </div>
              <div className="user-info-follower">
                <div>
                  <img
                    src="/icons/heart.png"
                    alt="follow"
                    className="user-info-icon"
                  />
                </div>
                {notif.follower ? (
                  <div>
                    <DateTooltip date={notif.follower} />
                  </div>
                ) : (
                  <div>No</div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
