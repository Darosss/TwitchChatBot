import React, { useEffect, useReducer, useState } from "react";

import { useSocketContext } from "@context/socket";
import StreamSessionEvents from "@components/streamSessionEvents";
import { SessionEvents } from "@services/StreamSessionService";

export default function StreamNotifications() {
  const LIMIT_NOTIFICATIONS = 5;

  const socketContext = useSocketContext();

  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const [userNotif, setUserNotif] = useState<SessionEvents[]>([]);

  useEffect(() => {
    const {
      events: { userJoinTwitchChat },
    } = socketContext;
    userJoinTwitchChat.on((eventAndUser) => {
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
      userJoinTwitchChat.off();
    };
  }, [socketContext, userNotif]);

  return <StreamSessionEvents sessionEvents={userNotif} />;
}
