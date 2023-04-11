import React, {
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";

import { Message as MessageType } from "@services/MessageService";
import Message from "@components/message";
import { SocketContext } from "@context/SocketContext";
import { addNotification } from "@utils/getNotificationValues";
import { getCurrentSessionMessages } from "@services/StreamSessionService";

export default function StreamChat() {
  const socket = useContext(SocketContext);
  const messagesRef = useRef<HTMLDivElement | null>(null);
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const [messagesDB, setMessagesDB] = useState<MessageType[]>();

  const [messages, setMessages] = useState<{
    [index: string]: { date: Date; username: string; message: string };
  }>();

  const [messageToSend, setMessageToSend] = useState("");

  const { data, loading, error, refetchData } = getCurrentSessionMessages();

  const chatToBottom = () => {
    setTimeout(() => {
      if (messagesRef.current)
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }, 100);
  };

  useEffect(() => {
    if (!data) return;
    setMessagesDB(data.data.reverse());

    chatToBottom();
  }, [data]);

  const sendMessage = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    addNotification("Message sent", messageToSend, "success");
    socket.emit("messageClient", messageToSend);
    chatToBottom();
  };

  useEffect(() => {
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
      chatToBottom();
    });

    return () => {
      socket.off("messageServer");
    };
  }, [socket]);

  return (
    <div id="stream-chat" className="stream-chat">
      <div className="widget-header chat-header">STREAM CHAT</div>
      <div className="stream-chat-messages" ref={messagesRef}>
        {messagesDB
          ? messagesDB.map((msg, index) => {
              return (
                <Message
                  key={index}
                  date={msg.date}
                  username={msg.ownerUsername}
                  message={msg.message}
                  tooltip={false}
                />
              );
            })
          : null}

        {messages
          ? [...Object.values(messages)].map((message, index) => {
              return (
                <Message
                  key={index}
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
