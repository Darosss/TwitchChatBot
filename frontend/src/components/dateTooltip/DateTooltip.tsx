import "./style.css";
import React from "react";

import moment from "moment";

export function DateTooltip(props: { date: moment.MomentInput }) {
  const { date } = props;

  return (
    <div className="tooltip">
      {moment(date).fromNow()}
      <span className="tooltiptext">
        {moment(date).format("dddd, MMMM Do YYYY, HH:mm:ss")}
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
  //years, months, weeks, days, hours, minutes, and seconds
  const { dateStart, dateEnd, format = "m", precise = true } = props;
  return (
    <div className="tooltip">
      {moment(dateEnd).diff(dateStart, format, precise).toFixed(1)} {format}
      <span className="tooltiptext">
        {moment(dateStart).format("ddd, HH:mm:ss")} <br />
        {moment(dateEnd).format("ddd, HH:mm:ss")}
      </span>
    </div>
  );
}
