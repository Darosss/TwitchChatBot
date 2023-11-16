import moment from "moment";

export const getDateFromSecondsToYMDHMS = (
  time: number,
  separatorYMD = " ",
  separatorHMS = ":"
) => {
  const duration = moment.duration(time, "seconds");

  const seconds = Math.floor(duration.seconds()).toString().padStart(2, "0");
  const minutes = Math.floor(duration.minutes()).toString().padStart(2, "0");
  const hours = Math.floor(duration.hours());
  const days = Math.floor(duration.days());
  const months = duration.months();
  const years = duration.years();
  const timeArray = [
    years > 0 ? `${years.toFixed(0)}y${separatorYMD}` : "",
    months > 0 ? `${months.toFixed(0)}m${separatorYMD}` : "",
    days > 0 ? `${days.toFixed(0)}d${separatorYMD}` : "",
    hours > 0 ? `${hours}${separatorHMS}` : "",
    `${minutes}${separatorHMS}`,
    seconds,
  ].filter(Boolean);

  return timeArray;
};
