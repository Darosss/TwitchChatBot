import "./style.css";
import React, { useContext, useEffect, useReducer, useState } from "react";

import { SocketContext } from "@context/SocketContext";
import formatDate from "@utils/formatDate";

export default function TwitchChatters(props: { className?: string }) {
  const LIMIT_LAST_CHATTERS = 14;
  const { className } = props;

  const socket = useContext(SocketContext);

  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const [lastChatters, setLastChatters] = useState(new Map<string, Date>());

  useEffect(() => {
    socket?.on("messageServer", (date, username, message) => {
      setLastChatters((prevState) => {
        prevState.set(username, date);

        let newState = new Map(
          [...prevState.entries()].sort(
            (a, b) => new Date(b[1]).getTime() - new Date(a[1]).getTime()
          )
        );

        if (newState.size > LIMIT_LAST_CHATTERS) {
          const lastChatterInMap = [...newState.keys()].pop();

          if (lastChatterInMap) {
            newState.delete(lastChatterInMap);
          }
        }

        return newState;
      });

      forceUpdate();
    });

    return () => {
      socket.off("messageServer");
    };
  }, [socket]);

  return (
    <div
      id="twitch-last-chatters"
      className={`twitch-last-chatters ${className ? className : ""}`}
    >
      {[...lastChatters.keys()].map((chatter, index) => {
        return (
          <div
            className={`user-chatter ${
              index + 1 === LIMIT_LAST_CHATTERS ? "limit" : ""
            }`}
            key={chatter + lastChatters.get(chatter)}
          >
            <div className="user-chatter-username">{chatter}</div>
            <div className="user-chatter-last-seen">
              {formatDate(lastChatters.get(chatter) || new Date(), "time")}
            </div>
          </div>
        );
      })}
    </div>
  );
}
