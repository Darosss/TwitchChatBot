import React, { MouseEvent, useContext, useEffect, useState } from "react";
import { SocketContext } from "@context/SocketContext";
import Message from "@components/Message";

import "./style.css";

export default function TwitchChat() {
  const socket = useContext(SocketContext);

  const [messageToSend, setMessageToSend] = useState("");
  const [messages, setMessages] = useState<{
    [index: string]: { date: Date; username: string; message: string };
  }>();

  const sendMessage = (e: MouseEvent<HTMLButtonElement>) => {
    console.log("SEND MESSAGE", messageToSend);
  };

  useEffect(() => {
    socket?.on("messageServer", (date, username, message) => {
      console.log("got message from server", date, username, message);
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

    return () => {
      socket.off("messageServer");
    };
  }, [socket]);

  return (
    <>
      <div className="twitch-chat-header">
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
    </>
  );
}
