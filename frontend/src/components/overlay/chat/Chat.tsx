import Message from "@components/message";
import { MessageServerData, useSocketContext } from "@socket";
import { useEffect } from "react";
import { useOverlayDataContext } from "../OverlayDataContext";
import { getExampleChatData } from "./exampleData";
import { useLocalStorage } from "@hooks";

const MAX_MESSAGES_IN_CACHE = 10;

export default function Chat() {
  const {
    events: { messageServer, messageServerDelete },
  } = useSocketContext();

  const {
    stylesState: [{ overlayChat: styles }],
    isEditorState: [isEditor],
  } = useOverlayDataContext();

  const [messagesData, setMessagesData] = useLocalStorage<MessageServerData[]>(
    "chatOverlayMessages",
    []
  );

  useEffect(() => {
    messageServer.on((data) => {
      setMessagesData((prevMessages) => [data, ...prevMessages]);
    });

    return () => {
      messageServer.off();
    };
  }, [messageServer, setMessagesData]);

  useEffect(() => {
    if (isEditor) setMessagesData(getExampleChatData());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditor]);

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
  }, [messageServerDelete, setMessagesData]);

  useEffect(() => {
    if (messagesData.length >= MAX_MESSAGES_IN_CACHE)
      messagesData.splice(MAX_MESSAGES_IN_CACHE, messagesData.length);
  }, [messagesData]);

  return (
    <div
      className="chat-overlay-wrapper"
      style={{
        borderRadius: styles.borderRadius,
      }}
    >
      <div
        className="chat-overlay-background"
        style={{
          background: styles.background,
          filter: `opacity(${styles.opacity}%)`,
          boxShadow: styles.boxShadow,
        }}
      ></div>
      <div className="chat-overlay-messages-wrapper">
        {messagesData.map(({ user, messageData }) => (
          <Message
            key={messageData.id}
            date={messageData.timestamp}
            username={user.username}
            message={messageData.message}
            emotes={messageData.emotes}
            badgesPaths={user.badgesPaths}
            tooltip={false}
            styles={{
              time: {
                color: styles.time.color,
                fontSize: styles.time.fontSize,
              },
              message: {
                color: styles.message.color,
                fontSize: styles.message.fontSize,
              },
              username: {
                color: styles.username.color,
                fontSize: styles.username.fontSize,
              },
              badges: {
                boxShadow: styles.badges.boxShadow,
                maxWidth: styles.badges.badgeSize,
                minWidth: styles.badges.badgeSize,
              },
            }}
          />
        ))}
      </div>
    </div>
  );
}
