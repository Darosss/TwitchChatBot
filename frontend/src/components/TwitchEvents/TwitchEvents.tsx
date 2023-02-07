import React, { useContext, useEffect, useState } from "react";
import { SocketContext } from "@context/SocketContext";

import "./style.css";
import TwitchChat from "./TwitchChat";
import TwitchNotifications from "./TwitchNotifications";
import TwitchChatters from "./TwitchChatters";

export default function TwitchEvents() {
  const socket = useContext(SocketContext);

  const [showChat, setShowChat] = useState(true);
  const [showLastChatters, setShowLastChatters] = useState(true);
  const [showNotifications, setShowNotifications] = useState(true);

  useEffect(() => {
    return () => {};
  }, [socket]);

  return (
    <div className="twitch-wrapper">
      {showChat ? (
        <TwitchChat />
      ) : (
        <button
          onClick={(e) => setShowChat(!showChat)}
          className="show-hide-twitch-btn"
        >
          Show chat
        </button>
      )}

      {showLastChatters ? (
        <TwitchChatters />
      ) : (
        <button
          onClick={(e) => setShowLastChatters(!showLastChatters)}
          className="show-hide-twitch-btn"
        >
          Show chatters
        </button>
      )}
      {showNotifications ? (
        <TwitchNotifications />
      ) : (
        <button
          onClick={(e) => setShowNotifications(!showNotifications)}
          className="show-hide-twitch-btn"
        >
          Show notifications
        </button>
      )}
    </div>
  );
}
