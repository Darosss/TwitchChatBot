import "./style.css";
import React from "react";

export default function Message(props: {
  date: Date;
  username: string;
  message: string;
}) {
  const { date, username, message } = props;

  return (
    <div className="chat-message">
      <div className="time">{date.toString().split("T")[1].split(".")[0]}</div>
      <div className="username">{username}</div>
      <div className="message">{message}</div>
    </div>
  );
}
