import "./style.css";
import React, { useReducer } from "react";

import HiddenMenu from "@components/HiddenMenu";
import WidgetWrapper from "@components/WidgetWrapper";
import useLocalStorage from "@hooks/useLocalStorage.hook";
import StreamChat from "./streamChat";
import StreamChatters from "./streamChatters";
import StreamNotifications from "./streamNotifications";
import StreamStatistics from "./streamStatistics";

interface IWidget {
  enabled: boolean;
  size?: { width: string; height: string }; // TODO: add size later
}

export default function StreamEvents() {
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const [chatWidget, setChatWidget] = useLocalStorage<IWidget>(
    "stream-chat-widget-data",
    { enabled: true }
  );
  const [chattersWidget, setChattersWidget] = useLocalStorage<IWidget>(
    "stream-chatters-widget-data",
    { enabled: true }
  );
  const [notificationsWidget, setNotificationsWidget] =
    useLocalStorage<IWidget>("stream-notifications-widget-data", {
      enabled: true,
    });
  const [statisticSession, setStatisticSession] = useLocalStorage<IWidget>(
    "stream-statistic-widget-data",
    {
      enabled: true,
    }
  );
  return (
    <div className="stream-wrapper">
      <div className="menu-widgets">
        <HiddenMenu>
          <li>
            <button
              className={`stream-btn ${
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
              className={`stream-btn ${
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
              className={`stream-btn ${
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
              className={`stream-btn ${
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
        <WidgetWrapper id="stream-window">
          <StreamChat className="stream-window" />
        </WidgetWrapper>
      ) : null}
      {chattersWidget?.enabled ? (
        <WidgetWrapper id="stream-last-chatters">
          <StreamChatters className="stream-window" />
        </WidgetWrapper>
      ) : null}
      {notificationsWidget?.enabled ? (
        <WidgetWrapper id="stream-notifications">
          <StreamNotifications className="stream-window" />
        </WidgetWrapper>
      ) : null}

      {statisticSession?.enabled ? (
        <WidgetWrapper id="stream-statistics" horizontal={true}>
          <StreamStatistics className="stream-window" />
        </WidgetWrapper>
      ) : null}
    </div>
  );
}
