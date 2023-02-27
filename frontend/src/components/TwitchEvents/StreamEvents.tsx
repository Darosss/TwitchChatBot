import "./style.css";
import React, { useReducer } from "react";

import TwitchChat from "./TwitchChat";
import TwitchNotifications from "./TwitchNotifications";
import TwitchChatters from "./TwitchChatters";
import HiddenMenu from "@components/HiddenMenu";
import WidgetWrapper from "@components/WidgetWrapper";
import useLocalStorage from "@hooks/useLocalStorage.hook";
import TwitchStatistics from "./TwitchStatistics";

interface IWidget {
  enabled: boolean;
  size?: { width: string; height: string }; // TODO: add size later
}

export default function TwitchEvents() {
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const [chatWidget, setChatWidget] = useLocalStorage<IWidget>(
    "twitch-chat-widget-data",
    { enabled: true }
  );
  const [chattersWidget, setChattersWidget] = useLocalStorage<IWidget>(
    "twitch-chatters-widget-data",
    { enabled: true }
  );
  const [notificationsWidget, setNotificationsWidget] =
    useLocalStorage<IWidget>("twitch-notifications-widget-data", {
      enabled: true,
    });
  const [statisticSession, setStatisticSession] = useLocalStorage<IWidget>(
    "twitch-statistic-widget-data",
    {
      enabled: true,
    }
  );
  return (
    <div className="twitch-wrapper">
      <div className="menu-widgets">
        <HiddenMenu>
          <li>
            <button
              className={`twitch-btn ${
                chatWidget.enabled ? "active" : "not-active"
              }`}
              onClick={() => {
                setChatWidget((prevLocalStorage) => {
                  prevLocalStorage.enabled = !prevLocalStorage.enabled;
                  return prevLocalStorage;
                });
                forceUpdate();
              }}
            >
              Toggle chat
            </button>
          </li>
          <li>
            <button
              className={`twitch-btn ${
                chattersWidget.enabled ? "active" : "not-active"
              }`}
              onClick={() => {
                setChattersWidget((prevLocalStorage) => {
                  prevLocalStorage.enabled = !prevLocalStorage.enabled;
                  return prevLocalStorage;
                });
                forceUpdate();
              }}
            >
              Toggle chatters
            </button>
          </li>
          <li>
            <button
              className={`twitch-btn ${
                notificationsWidget.enabled ? "active" : "not-active"
              }`}
              onClick={() => {
                setNotificationsWidget((prevLocalStorage) => {
                  prevLocalStorage.enabled = !prevLocalStorage.enabled;
                  return prevLocalStorage;
                });
                forceUpdate();
              }}
            >
              Toggle notifications
            </button>
          </li>
          <li>
            <button
              className={`twitch-btn ${
                statisticSession.enabled ? "active" : "not-active"
              }`}
              onClick={() => {
                setStatisticSession((prevLocalStorage) => {
                  prevLocalStorage.enabled = !prevLocalStorage.enabled;
                  return prevLocalStorage;
                });
                forceUpdate();
              }}
            >
              Toggle statistics
            </button>
          </li>
        </HiddenMenu>
      </div>

      {chatWidget?.enabled ? (
        <WidgetWrapper id="twitch-window">
          <TwitchChat className="twitch-window" />
        </WidgetWrapper>
      ) : null}
      {chattersWidget?.enabled ? (
        <WidgetWrapper id="twitch-last-chatters">
          <TwitchChatters className="twitch-window" />
        </WidgetWrapper>
      ) : null}
      {notificationsWidget?.enabled ? (
        <WidgetWrapper id="twitch-notifications">
          <TwitchNotifications className="twitch-window" />
        </WidgetWrapper>
      ) : null}

      {statisticSession?.enabled ? (
        <WidgetWrapper id="twitch-statistics" horizontal={true}>
          <TwitchStatistics className="twitch-window" />
        </WidgetWrapper>
      ) : null}
    </div>
  );
}
