import React, { useEffect, useState } from "react";

import { useSocketContext } from "@socket";
import { DateTooltip } from "@components/dateTooltip";

export default function StreamChatters() {
  const LIMIT_LAST_CHATTERS = 14;

  const socketContext = useSocketContext();

  const [lastChatters, setLastChatters] = useState(new Map<string, Date>());

  useEffect(() => {
    const {
      events: { messageServer },
    } = socketContext;

    messageServer.on((data) => {
      setLastChatters((prevState) => {
        prevState.set(data.user.username, new Date(data.messageData.timestamp));

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
    });

    return () => {
      messageServer.off();
    };
  }, [socketContext]);

  return (
    <div id="stream-last-chatters" className="stream-last-chatters">
      <div className="widget-header"> Last chatters </div>
      {[...lastChatters.keys()].map((chatter, index) => (
        <div
          className={`user-chatter ${
            index + 1 === LIMIT_LAST_CHATTERS ? "limit" : ""
          }`}
          key={index}
        >
          <div className="user-chatter-username">{chatter}</div>
          <div className="user-chatter-last-seen">
            <DateTooltip date={lastChatters.get(chatter) || new Date()} />
          </div>
        </div>
      ))}
    </div>
  );
}
