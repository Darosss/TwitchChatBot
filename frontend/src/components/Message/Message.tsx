import "./style.css";
import React from "react";
import formatDate from "@utils/formatDate";

export default function Message(props: {
  date: Date;
  username: string;
  message: string;
}) {
  const { date, username, message } = props;

  return (
    <div className="chat-message">
      <div className="time">{formatDate(date)}</div>
      <div className="username">{username}</div>
      <div className="message">{message}</div>
    </div>
  );
}
