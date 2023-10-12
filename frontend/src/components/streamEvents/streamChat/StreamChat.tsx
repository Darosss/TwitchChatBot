import React, { useCallback, useEffect, useRef, useState } from "react";

import { Message as MessageType } from "@services";
import Message from "@components/message";
import { useSocketContext } from "@context/socket";
import { addNotification } from "@utils";
import { useGetCurrentSessionMessages } from "@services";

interface LocalMessage {
  date: Date;
  username: string;
  message: string;
}

export default function StreamChat() {
  const socketContext = useSocketContext();
  const messagesRef = useRef<HTMLDivElement | null>(null);

  const [messagesDB, setMessagesDB] = useState<MessageType[]>([]);
  const [messages, setMessages] = useState<LocalMessage[]>([]);

  const [messageToSend, setMessageToSend] = useState("");

  const { data } = useGetCurrentSessionMessages();

  const chatToBottom = () => {
    setTimeout(() => {
      if (!messagesRef.current) return;

      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }, 100);
  };

  useEffect(() => {
    if (!data) return;
    setMessagesDB(data.data.reverse());

    chatToBottom();
  }, [data]);

  const sendMessage = useCallback(() => {
    const {
      emits: { messageClient },
    } = socketContext;
    addNotification("Message sent", messageToSend, "success");
    messageClient(messageToSend);
    chatToBottom();
  }, [socketContext, messageToSend]);

  useEffect(() => {
    const {
      events: { messageServer },
    } = socketContext;
    messageServer.on((date, username, message) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { date, username, message },
      ]);

      chatToBottom();
    });

    return () => {
      messageServer.off();
    };
  }, [socketContext]);

  return (
    <div id="stream-chat" className="stream-chat">
      <div className="widget-header chat-header">STREAM CHAT</div>
      <div className="stream-chat-messages" ref={messagesRef}>
        {messagesDB.map((msg, index) => (
          <Message
            key={index}
            date={msg.date}
            username={msg.ownerUsername}
            message={msg.message}
            tooltip={false}
          />
        ))}

        {messages.map((message, index) => (
          <Message
            key={index}
            date={message.date}
            username={message.username}
            message={message.message}
            tooltip={false}
          />
        ))}
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
          onClick={() => sendMessage()}
          className="stream-chat-btn-send-message"
        >
          SEND
        </button>
      </div>
    </div>
  );
}
