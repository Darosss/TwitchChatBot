import "./style.css";
import React, { useEffect, useState } from "react";

import TwitchChat from "./TwitchChat";
import TwitchNotifications from "./TwitchNotifications";
import TwitchChatters from "./TwitchChatters";
import HiddenMenu from "@components/HiddenMenu";

export default function TwitchEvents() {
  const [showChat, setShowChat] = useState<boolean>();
  const [showLastChatters, setShowLastChatters] = useState<boolean>();
  const [showNotifications, setShowNotifications] = useState<boolean>();

  useEffect(() => {
    const localWidgets = localStorage.getItem("widgets-info");
    if (localWidgets) {
      const localWidgetsParsed = JSON.parse(localWidgets);

      setShowChat(localWidgetsParsed.twitchChat);
      setShowLastChatters(localWidgetsParsed.twitchChatters);
      setShowNotifications(localWidgetsParsed.twitchNotifications);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "widgets-info",
      JSON.stringify({
        twitchChat: showChat,
        twitchChatters: showLastChatters,
        twitchNotifications: showNotifications,
      })
    );
  }, [showChat, showLastChatters, showNotifications]);

  return (
    <div className="twitch-wrapper">
      <div className="menu-widgets">
        <HiddenMenu>
          <li>
            <button
              className={`twitch-btn ${showChat ? "active" : "not-active"}`}
              onClick={(e) => {
                setShowChat(!showChat);
              }}
            >
              Toggle chat
            </button>
          </li>
          <li>
            <button
              className={`twitch-btn ${
                showLastChatters ? "active" : "not-active"
              }`}
              onClick={(e) => {
                setShowLastChatters(!showLastChatters);
              }}
            >
              Toggle chatters
            </button>
          </li>
          <li>
            <button
              className={`twitch-btn ${
                showNotifications ? "active" : "not-active"
              }`}
              onClick={(e) => {
                setShowNotifications(!showNotifications);
              }}
            >
              Toggle notifications
            </button>
          </li>
        </HiddenMenu>
      </div>

      {showChat ? <TwitchChat className="twitch-window" /> : null}
      {showLastChatters ? <TwitchChatters className="twitch-window" /> : null}
      {showNotifications ? (
        <TwitchNotifications className="twitch-window" />
      ) : null}
    </div>
  );
}
