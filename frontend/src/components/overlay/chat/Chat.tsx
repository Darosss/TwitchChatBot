import Message from "@components/message";
import { MessageServerData, useSocketContext } from "@socket";
import { useEffect, useRef, useState } from "react";

const MAX_MESSAGES_IN_CACHE = 10;

export default function Chat() {
  const {
    events: { messageServer, messageServerDelete },
  } = useSocketContext();

  const wrapper = useRef<HTMLDivElement>(null);

  const [messagesData, setMessagesData] = useState<MessageServerData[]>([]);
  useEffect(() => {
    messageServer.on((data) => {
      setMessagesData((prevMessages) => [data, ...prevMessages]);
    });

    return () => {
      messageServer.off();
    };
  }, [messageServer]);

  useEffect(() => {
    messageServerDelete.on((data) => {
      setMessagesData((prevMessages) => {
        const messagesWithoutDeletedMsg = prevMessages.filter(
          (val) => val.messageData.id !== data.userstate["target-msg-id"]
        );

        return messagesWithoutDeletedMsg;
      });
    });

    return () => {
      messageServerDelete.off();
    };
  }, [messageServerDelete]);

  useEffect(() => {
    if (messagesData.length >= MAX_MESSAGES_IN_CACHE)
      messagesData.splice(MAX_MESSAGES_IN_CACHE, messagesData.length);
  }, [messagesData]);

  return (
    <div
      className="chat-overlay-wrapper"
      ref={wrapper}
      style={{
        fontSize: `${
          wrapper.current ? `${wrapper.current.offsetWidth / 600}rem` : "2rem"
        }`,
      }}
    >
      <div className="chat-overlay-background"></div>
      {messagesData.map(({ user, messageData }) => (
        <Message
          key={messageData.id}
          date={messageData.timestamp}
          username={user.username}
          message={messageData.message}
          emotes={messageData.emotes}
          badgesPaths={user.badgesPaths}
          tooltip={false}
        />
      ))}
    </div>
  );
}
