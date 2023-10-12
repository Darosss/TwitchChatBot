import React, { useEffect, useState } from "react";

import { useSocketContext } from "@context";
import StreamSessionEvents from "@components/streamSessionEvents";
import { SessionEvents } from "@services";

export default function StreamNotifications() {
  const LIMIT_NOTIFICATIONS = 5;

  const socketContext = useSocketContext();

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
        return [...prevState];
      });

      if (userNotif?.length > LIMIT_NOTIFICATIONS) {
        setUserNotif((prevState) => {
          prevState.pop();
          return [...prevState];
        });
      }
    });

    return () => {
      userJoinTwitchChat.off();
    };
  }, [socketContext, userNotif]);

  return <StreamSessionEvents sessionEvents={userNotif} />;
}
