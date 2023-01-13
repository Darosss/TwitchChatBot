import React, { MouseEvent, useContext, useEffect, useState } from "react";
import { SocketContext } from "../../Context/SocketContext";

import "./style.css";

function TwitchChat() {
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
  }, []);

  return (
    <>
      <div className="twitch-chat-header">
        CHAT BOOKSAREFUNSOMETIMES
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
                    <div
                      key={message.date.toString() + message.username}
                      className="chat-message"
                    >
                      <div className="time">
                        {message.date?.toString().split("T")[1].split(".")[0]}
                      </div>
                      <div className="username">{message.username}</div>
                      <div className="message">{message.message}</div>
                    </div>
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

export default TwitchChat;
