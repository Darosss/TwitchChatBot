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
