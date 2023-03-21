import "./style.css";
import React from "react";

import { DateTooltip } from "@components/dateTooltip";

export default function Message(props: {
  date: Date;
  username: string;
  message: string;
}) {
  const { date, username, message } = props;

  return (
    <div className="chat-message">
      <div className="time">
        <DateTooltip date={date} />
      </div>
      <div className="username">{username}</div>
      <div className="message">{message}</div>
    </div>
  );
}
