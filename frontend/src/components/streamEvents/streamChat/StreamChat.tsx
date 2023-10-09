import React, {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";

import { Message as MessageType } from "@services/MessageService";
import Message from "@components/message";
import { useSocketContext } from "@context/socket";
import { addNotification } from "@utils/getNotificationValues";
import { useGetCurrentSessionMessages } from "@services/StreamSessionService";

export default function StreamChat() {
  const socketContext = useSocketContext();
  const messagesRef = useRef<HTMLDivElement | null>(null);
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const [messagesDB, setMessagesDB] = useState<MessageType[]>();

  const [messages, setMessages] = useState<{
    [index: string]: { date: Date; username: string; message: string };
  }>();

  const [messageToSend, setMessageToSend] = useState("");

  const { data } = useGetCurrentSessionMessages();

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
      messageServer.off();
    };
  }, [socketContext]);

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
          onClick={() => sendMessage()}
          className="stream-chat-btn-send-message"
        >
          SEND
        </button>
      </div>
    </div>
  );
}
