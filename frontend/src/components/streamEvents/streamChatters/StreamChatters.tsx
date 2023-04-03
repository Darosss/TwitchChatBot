import React, { useContext, useEffect, useReducer, useState } from "react";

import { SocketContext } from "@context/SocketContext";
import { DateTooltip } from "@components/dateTooltip";

export default function StreamChatters() {
  const LIMIT_LAST_CHATTERS = 14;

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
    <div id="stream-last-chatters" className="stream-last-chatters">
      <div className="widget-header"> Last chatters </div>
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
              <DateTooltip date={lastChatters.get(chatter) || new Date()} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
