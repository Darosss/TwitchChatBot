import React, { useContext, useEffect, useReducer, useState } from "react";

import { SocketContext, EventAndUser } from "@context/socket";
import { Link } from "react-router-dom";
import { DateTooltip } from "@components/dateTooltip";
import moment from "moment";
import StreamSessionEvents from "@components/streamSessionEvents";
import { SessionEvents } from "@services/StreamSessionService";

export default function StreamNotifications() {
  const LIMIT_NOTIFICATIONS = 5;

  const socket = useContext(SocketContext);

  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const [userNotif, setUserNotif] = useState<SessionEvents[]>([]);

  const removeParentElement = (
    e: React.MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    (e.target as HTMLButtonElement).parentElement?.remove();
  };

  useEffect(() => {
    socket?.on("userJoinTwitchChat", (eventAndUser) => {
      setUserNotif((prevState) => {
        prevState.unshift({
          _id: eventAndUser.eventDate.toString() + Date.now(),
          user: eventAndUser.user,
          name: eventAndUser.eventName,
          createdAt: eventAndUser.eventDate,
          updatedAt: eventAndUser.eventDate,
        });
        return prevState;
      });

      if (userNotif?.length > LIMIT_NOTIFICATIONS) {
        setUserNotif((prevState) => {
          prevState.pop();
          return prevState;
        });
      }
      forceUpdate();
    });

    return () => {
      socket.off("userJoinTwitchChat");
    };
  }, [socket]);

  return <StreamSessionEvents sessionEvents={userNotif} />;
}
