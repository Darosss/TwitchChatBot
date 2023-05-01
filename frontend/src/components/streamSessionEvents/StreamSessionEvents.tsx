import React from "react";

import { DateTooltip } from "@components/dateTooltip/DateTooltip";
import moment from "moment";
import { Link } from "react-router-dom";
import { SessionEvents } from "@services/StreamSessionService";

interface StreamSessionProps {
  sessionEvents: SessionEvents[];
}

export default function StreamSessionEvents(props: StreamSessionProps) {
  const { sessionEvents } = props;
  return (
    <div id="stream-notifications" className="stream-notifications">
      <div className="widget-header"> Stream notifications </div>
      {sessionEvents.map((event, index) => {
        console.log(
          new Date(event.user.createdAt).getTime() / 1000 -
            new Date(event.createdAt).getTime() / 1000
        );
        return (
          <div
            className={`user-info ${
              event.name === "Left chat" ? "left-chat" : ""
            } ${
              Math.floor(
                new Date(event.user.createdAt).getTime() / 1000 -
                  new Date(event.createdAt).getTime() / 1000
              ) > 1200
                ? "new-user"
                : "usual"
            } `}
            key={index}
          >
            <div className="user-info-event-data-wrapper">
              <div className="user-info-username">
                <Link to={`/users/${event._id}`} target="_blank">
                  {event.user.username}
                </Link>
              </div>
              <div className="user-info-event">{event.name}</div>
              <div className="user-info-date">
                {moment(event.createdAt).fromNow()}
              </div>
            </div>

            <div className="user-info-user-data-wrapper">
              <div className="user-info-messages">
                <div>
                  <img
                    src="/icons/message.png"
                    alt="msg"
                    className="user-info-icon"
                  />
                </div>
                <div>{event.user.messageCount?.toLocaleString()}</div>
              </div>

              <div className="user-info-points">
                <div>
                  <img
                    src="/icons/finger.png"
                    alt="points"
                    className="user-info-icon"
                  />
                </div>
                <div>{event.user.points?.toLocaleString()}</div>
              </div>

              {/* <div className="user-info-subsriber">
              <div>
                <img
                  src="/icons/star.png"
                  alt="sub"
                  className="user-info-icon"
                />
              </div>
              <div> 2020-20-20</div>
            </div> */}
            </div>

            <div className="user-info-user-dates-wrapper">
              <div className="user-info-created-date">
                <div>
                  <img
                    src="/icons/calendar.png"
                    alt="created"
                    className="user-info-icon"
                  />
                </div>
                <div>
                  <DateTooltip date={event.createdAt} />
                </div>
              </div>
              <div className="user-info-last-seen">
                <div>
                  <img
                    src="/icons/eyes.png"
                    alt="seen"
                    className="user-info-icon"
                  />
                </div>

                <div>
                  {event.user.lastSeen ? (
                    <DateTooltip date={event.user.lastSeen} />
                  ) : null}
                </div>
              </div>
              <div className="user-info-follower">
                <div>
                  <img
                    src="/icons/heart.png"
                    alt="follow"
                    className="user-info-icon"
                  />
                </div>
                {event.user.follower ? (
                  <div>
                    <DateTooltip date={event.user.follower} />
                  </div>
                ) : (
                  <div>No</div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
