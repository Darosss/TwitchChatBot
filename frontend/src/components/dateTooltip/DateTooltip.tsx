import React from "react";

import moment from "moment";

export function DateTooltip(props: {
  date: moment.MomentInput;
  suffix?: boolean;
}) {
  const { date, suffix = true } = props;

  return (
    <div className="tooltip">
      <span className="tooltip-default">{moment(date).fromNow(!suffix)}</span>
      <span className="tooltip-text">
        {moment(date).format("dddd, MMMM Do YYYY, HH:mm:ss")}
      </span>
    </div>
  );
}

export function DateTimeTooltip(props: {
  date: moment.MomentInput;
  suffix?: boolean;
}) {
  const { date, suffix = true } = props;

  return (
    <div className="tooltip">
      <span className="tooltip-default">{moment(date).format("HH:mm:ss")}</span>
      <span className="tooltip-text">
        {moment(date).format("MM D YYYY, HH:mm:ss")}
      </span>
    </div>
  );
}

export function DateDifference(props: {
  dateStart: Date;
  dateEnd: Date;
  format?: moment.unitOfTime.Diff;
  precise?: boolean;
}) {
  const { dateStart, dateEnd, format = "m", precise = true } = props;
  return (
    <div className="tooltip">
      <span className="tooltip-default">
        {moment(dateEnd).diff(dateStart, format, precise).toFixed(1)} {format}
      </span>
      <span className="tooltip-text">
        {moment(dateStart).format("ddd, HH:mm:ss")} <br />
        {moment(dateEnd).format("ddd, HH:mm:ss")}
      </span>
    </div>
  );
}
