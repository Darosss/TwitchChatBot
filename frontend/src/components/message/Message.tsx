import React, { CSSProperties, useMemo } from "react";

import { DateTimeTooltip } from "@components/dateTooltip/DateTooltip";
import moment from "moment";
import { MessageServerData, MessageServerDataBadgesPathsType } from "@socket";
import { viteBackendUrl } from "@configs/envVariables";
import { getMessagesWithEmotes, getTwitchEmoteUrl } from "@utils";

type MessageStylesBadges = Partial<
  Pick<CSSProperties, "maxWidth" | "minWidth">
> & {
  boxShadow: string;
};
interface MessageStylesProps {
  time?: Partial<Pick<CSSProperties, "color" | "fontSize">>;
  username?: Partial<Pick<CSSProperties, "color" | "fontSize">>;
  message?: Partial<Pick<CSSProperties, "color" | "fontSize">>;
  badges?: MessageStylesBadges;
}
export interface MessageProps {
  date: number | Date;
  username: string;
  message: string;
  emotes?: MessageServerData["messageData"]["emotes"];
  tooltip?: boolean;
  badgesPaths?: MessageServerData["user"]["badgesPaths"];
  styles?: MessageStylesProps;
}

export default function Message({
  date,
  username,
  message,
  tooltip = true,
  badgesPaths,
  emotes,
  styles,
}: MessageProps) {
  const messageWithEmotes = useMemo(() => {
    if (!emotes || Object.keys(emotes).length === 0) return message;
    const data = getMessagesWithEmotes({ message, emotes });
    return data?.map(({ value, emoteId }, index) => (
      <React.Fragment key={index}>
        {emoteId ? (
          <img
            style={{ maxWidth: "18px" }}
            src={`${getTwitchEmoteUrl({ id: emoteId })}`}
            alt={value}
          />
        ) : (
          <>{value.trim()}</>
        )}
      </React.Fragment>
    ));
  }, [emotes, message]);
  return (
    <div className="chat-wrapper">
      <div className="chat-message">
        <div className="ms-time" style={styles?.time}>
          {tooltip ? (
            <DateTimeTooltip date={date} />
          ) : (
            moment(date).format("HH:mm:ss")
          )}
        </div>

        <div className="ms-username" style={styles?.username}>
          {badgesPaths ? (
            <div className="chat-message-badges">
              <MessageBadges paths={badgesPaths} style={styles?.badges} />
            </div>
          ) : null}
          {username}:
        </div>
        <span className="ms-message" style={styles?.message}>
          {messageWithEmotes}
        </span>
      </div>
    </div>
  );
}
interface MessageBadgesProps {
  paths: MessageServerDataBadgesPathsType;
  style?: MessageStylesBadges;
}
function MessageBadges({ paths, style }: MessageBadgesProps) {
  return (
    <>
      {paths.map((path, index) =>
        path ? (
          <img
            key={index}
            src={`${viteBackendUrl}\\${path}`}
            alt="[]"
            style={{
              maxWidth: style?.maxWidth,
              minWidth: style?.minWidth,
              boxShadow: style?.boxShadow,
            }}
          />
        ) : null
      )}
    </>
  );
}
