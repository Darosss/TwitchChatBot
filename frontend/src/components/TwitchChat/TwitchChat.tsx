import React, {
  MouseEvent,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { SocketContext } from "@context/SocketContext";
import Message from "@components/Message";

import "./style.css";
import formatDate from "@utils/formatDate";
import { Link } from "react-router-dom";
import { IEventAndIUser } from "@libs/types";

export default function TwitchChat() {
  const LIMIT_NOTIFICATIONS = 5;
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const socket = useContext(SocketContext);
  const notifications = useRef<HTMLDivElement>(null);

  const [messageToSend, setMessageToSend] = useState("");
  const [messages, setMessages] = useState<{
    [index: string]: { date: Date; username: string; message: string };
  }>();

  const [userNotif, setUserNotif] = useState<IEventAndIUser[]>([]);

  const sendMessage = (e: MouseEvent<HTMLButtonElement>) => {
    console.log("SEND MESSAGE", messageToSend);
  };

  const removeParentElement = (
    e: React.MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    (e.target as HTMLButtonElement).parentElement?.remove();
  };

  useEffect(() => {
    socket?.on("messageServer", (date, username, message) => {
      setMessages((prevMessages) => {
        const newMessages = { ...prevMessages };
        newMessages[Math.random() * 100] = {
          date: date,
          username: username,
          message: message,
        };
        return newMessages;
      });
    });

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
      socket.off("messageServer");
      socket.off("userJoinTwitchChat");
    };
  }, [socket]);
  return (
    <>
      <div className="twitch-chat twitch-window">
        <div className="twitch-chat-title">STREAM CHAT</div>
        <div className="twitch-chat-messages">
          {messages
            ? [...Object.values(messages)]
                .sort((a, b) => {
                  return (
                    (new Date(b.date) as unknown as number) -
                    (new Date(a.date) as unknown as number)
                  );
                })
                .map((message) => {
                  return (
                    <Message
                      key={message.date + message.username}
                      date={message.date}
                      username={message.username}
                      message={message.message}
                    />
                  );
                })
            : null}
        </div>
        <div className="twitch-chat-send-message">
          <textarea
            className="twitch-chat-textarea"
            onChange={(e) => setMessageToSend(e.target.value)}
            value={messageToSend}
          />
          <button
            onClick={(e) => sendMessage(e)}
            className="twitch-chat-btn-send-message"
          >
            SEND
          </button>
        </div>
      </div>
      <div className="twitch-notifications twitch-window" ref={notifications}>
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
                : <span>today, 15:12:12</span>
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
                <img
                  src="/icons/star.png"
                  alt="sub"
                  className="user-info-icon"
                />
                <span> 2020-20-20</span>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
