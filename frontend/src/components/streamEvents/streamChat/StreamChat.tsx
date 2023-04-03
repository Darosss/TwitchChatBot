import React, { useContext, useEffect, useReducer, useState } from "react";

import Message from "@components/message";
import { SocketContext } from "@context/SocketContext";
import { addNotification } from "@utils/getNotificationValues";

export default function StreamChat() {
  const socket = useContext(SocketContext);

  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const [messages, setMessages] = useState<{
    [index: string]: { date: Date; username: string; message: string };
  }>();

  const [messageToSend, setMessageToSend] = useState("");

  const sendMessage = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    addNotification("Message sent", messageToSend, "success");
    socket.emit("messageClient", messageToSend);
  };

  useEffect(() => {
    //add timeout - dunno why socket doesnt work without that
    // FIXME: later
    setTimeout(() => {
      console.log("timeout");
      socket.on("messageServer", (date, username, message) => {
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
    }, 500);

    return () => {
      socket.off("messageServer");
    };
  }, [socket]);

  return (
    <div id="stream-chat" className="stream-chat">
      <div className="widget-header chat-header">STREAM CHAT</div>
      <div className="stream-chat-messages">
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
                    tooltip={false}
                  />
                );
              })
          : null}
      </div>
      <div className="stream-chat-send-message-textarea">
        <textarea
          className="stream-chat-textarea"
          onChange={(e) => setMessageToSend(e.target.value)}
          value={messageToSend}
        />
      </div>
      <div className="stream-chat-send-message-btn">
        <button
          onClick={(e) => sendMessage(e)}
          className="stream-chat-btn-send-message"
        >
          SEND
        </button>
      </div>
    </div>
  );
}
