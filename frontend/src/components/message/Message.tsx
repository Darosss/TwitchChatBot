import React from "react";

import { DateTimeTooltip } from "@components/dateTooltip/DateTooltip";
import moment from "moment";

export interface MessageProps {
  date: Date;
  username: string;
  message: string;
  tooltip?: boolean;
}

export default function Message(props: MessageProps) {
  const { date, username, message, tooltip = true } = props;

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
        <div className="ms-username">{username}: </div>
        <span className="ms-message">{message}</span>
      </div>
    </div>
  );
}
