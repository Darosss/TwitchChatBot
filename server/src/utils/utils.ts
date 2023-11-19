import moment from "moment";

export const shuffleArray = <T = unknown>(array: Array<T>) => {
  return array.sort(() => 0.5 - Math.random());
};

export const removeDifferenceFromSet = (originalSet: Set<string>, toBeRemovedSet: Set<string>) => {
  [...toBeRemovedSet].forEach(function (v) {
    originalSet.delete(v);
  });
};

export const getLastNItemsFromMap = (map: Map<unknown, unknown>, n = 0) => {
  return map ? Array.from(map.entries()).slice(-n) : [];
};

export const randomWithMax = (max: number) => {
  return Math.floor(Math.random() * max);
};

export const percentChance = (percent: number) => {
  const ran = Math.random() * 100;
  if (ran <= percent) return true;

  return false;
};

export const convertSecondsToMS = (secondsConvert: number) => {
  const duration = moment.duration(secondsConvert, "seconds");
  const minutes = Math.floor(duration.asMinutes());
  const seconds = (Math.floor(duration.asSeconds()) % 60).toString().padStart(2, "0");
  return [minutes, seconds];
};

export const isValidUrl = (urlString: string) => {
  try {
    return Boolean(new URL(urlString));
  } catch (e) {
    return false;
  }
};

export const getBaseLog = (x: number, y: number) => {
  return Math.log(y) / Math.log(x);
};

//NOTE: there is same function in /frontend folder
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
    seconds > 0 ? `${seconds}s` : ""
  ].filter(Boolean);
  return timeArray.join("");
};

export const generateRandomWord = () => {
  return (Math.random() + 1).toString(36).substring(7);
};
