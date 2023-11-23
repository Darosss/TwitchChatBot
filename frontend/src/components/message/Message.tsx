import React, { useMemo } from "react";

import { DateTimeTooltip } from "@components/dateTooltip/DateTooltip";
import moment from "moment";
import { MessageServerData } from "@socket";
import { viteBackendUrl } from "src/configs/envVariables";
import { getMessagesWithEmotes, getTwitchEmoteUrl } from "@utils";

export interface MessageProps {
  date: number | Date;
  username: string;
  message: string;
  emotes?: MessageServerData["messageData"]["emotes"];
  tooltip?: boolean;
  badgesPaths?: MessageServerData["user"]["badgesPaths"];
}

export default function Message({
  date,
  username,
  message,
  tooltip = true,
  badgesPaths,
  emotes,
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
        <div className="ms-time">
          {tooltip ? (
            <DateTimeTooltip date={date} />
          ) : (
            moment(date).format("HH:mm:ss")
          )}
        </div>

        <div className="ms-username">
          {badgesPaths ? (
            <div className="chat-message-badges">
              {badgesPaths[0] ? (
                <img src={`${viteBackendUrl}\\${badgesPaths[0]}`} alt="[]" />
              ) : null}
              {badgesPaths[1] ? (
                <img src={`${viteBackendUrl}\\${badgesPaths[1]}`} alt="[]" />
              ) : null}
              {badgesPaths[2] ? (
                <img src={`${viteBackendUrl}\\${badgesPaths[2]}`} alt="[]" />
              ) : null}
            </div>
          ) : null}
          {username}:
        </div>
        <span className="ms-message">{messageWithEmotes}</span>
      </div>
    </div>
  );
}
