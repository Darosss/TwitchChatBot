import moment from "moment";

export const convertSecondsToMS = (secondsConvert: number) => {
  const duration = moment.duration(secondsConvert, "seconds");
  const minutes = Math.floor(duration.asMinutes());
  const seconds = (Math.floor(duration.asSeconds()) % 60)
    .toString()
    .padStart(2, "0");
  return [minutes, seconds];
};
