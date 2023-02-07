import "./style.css";
import React, { useEffect, useRef, useState } from "react";

import TwitchChat from "./TwitchChat";
import TwitchNotifications from "./TwitchNotifications";
import TwitchChatters from "./TwitchChatters";
import HiddenMenu from "@components/HiddenMenu";
import WidgetWrapper from "@components/WidgetWrapper";

interface IWidget {
  enabled: boolean;
  size?: { width: string; height: string }; // TODO: add size later
}

export default function TwitchEvents() {
  const [showChat, setShowChat] = useState<IWidget>();
  const [showLastChatters, setShowLastChatters] = useState<IWidget>();
  const [showNotifications, setShowNotifications] = useState<IWidget>();

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
                setShowChat((prevState) => {
                  if (prevState) {
                    prevState.enabled = !prevState.enabled;
                    return prevState;
                  }

                  return { enabled: true };
                });
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
                setShowLastChatters((prevState) => {
                  if (prevState) {
                    prevState.enabled = !prevState.enabled;
                    return prevState;
                  }

                  return { enabled: true };
                });
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
                setShowNotifications((prevState) => {
                  if (prevState) {
                    prevState.enabled = !prevState.enabled;
                    return prevState;
                  }

                  return { enabled: true };
                });
              }}
            >
              Toggle notifications
            </button>
          </li>
        </HiddenMenu>
      </div>

      {showChat?.enabled ? (
        <WidgetWrapper id="twitch-window">
          <TwitchChat className="twitch-window" />
        </WidgetWrapper>
      ) : null}
      {showLastChatters?.enabled ? (
        <WidgetWrapper id="twitch-last-chatters">
          <TwitchChatters className="twitch-window" />
        </WidgetWrapper>
      ) : null}
      {showNotifications?.enabled ? (
        <WidgetWrapper id="twitch-notifications">
          <TwitchNotifications className="twitch-window" />
        </WidgetWrapper>
      ) : null}
    </div>
  );
}
