import moment from "moment";

export const getDateFromSecondsToYMDHMS = (time: number, separator = " ") => {
  const duration = moment.duration(time, "seconds");

  const seconds = Math.floor(duration.seconds());
  const minutes = Math.floor(duration.minutes());
  const hours = Math.floor(duration.hours());
  const days = Math.floor(duration.days());
  const months = duration.months();
  const years = duration.years();
  const timeArray = [
    years > 0 ? `${years.toFixed(0)}y${separator}` : "",
    months > 0 ? `${months.toFixed(0)}m${separator}` : "",
    days > 0 ? `${days.toFixed(0)}d${separator}` : "",
    hours > 0 ? `${hours}h${separator}` : "",
    minutes > 0 ? `${minutes}m${separator}` : "",
    seconds > 0 ? `${seconds}s` : "",
  ].filter(Boolean);
  return timeArray.join("");
};
