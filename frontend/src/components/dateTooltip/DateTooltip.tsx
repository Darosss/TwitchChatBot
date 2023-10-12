import React from "react";
import moment from "moment";

interface DateTooltipCommonProps {
  date: moment.MomentInput;
}

interface DateTooltipProps extends DateTooltipCommonProps {
  suffix?: boolean;
}

interface DateDifferenceProps {
  dateStart: Date;
  dateEnd: Date;
  format?: moment.unitOfTime.Diff;
  precise?: boolean;
}

export function DateTooltip({ date, suffix }: DateTooltipProps) {
  return (
    <div className="tooltip">
      <span className="tooltip-default">{moment(date).fromNow(!suffix)}</span>
      <span className="tooltip-text">
        {moment(date).format("dddd, MMMM Do YYYY, HH:mm:ss")}
      </span>
    </div>
  );
}

export function DateTimeTooltip({ date }: DateTooltipCommonProps) {
  return (
    <div className="tooltip">
      <span className="tooltip-default">{moment(date).format("HH:mm:ss")}</span>
      <span className="tooltip-text">
        {moment(date).format("MM D YYYY, HH:mm:ss")}
      </span>
    </div>
  );
}

export function DateDifference({
  dateStart,
  dateEnd,
  format = "m",
  precise = true,
}: DateDifferenceProps) {
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
