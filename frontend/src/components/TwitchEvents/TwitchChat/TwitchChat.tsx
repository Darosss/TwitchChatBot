import "./style.css";
import React, { useContext, useEffect, useReducer, useState } from "react";

import Message from "@components/Message";
import { SocketContext } from "@context/SocketContext";

export default function TwitchChat(props: { className?: string }) {
  const { className } = props;
  const socket = useContext(SocketContext);

  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const [messages, setMessages] = useState<{
    [index: string]: { date: Date; username: string; message: string };
  }>();

  const [messageToSend, setMessageToSend] = useState("");

  const sendMessage = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    console.log("SEND MESSAGE", messageToSend);
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

      forceUpdate();
    });

    return () => {
      socket.off("messageServer");
    };
  }, [socket]);

  return (
    <div
      id="twitch-chat"
      className={`twitch-chat ${className ? className : ""}`}
    >
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
  );
}