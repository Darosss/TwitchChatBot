export const getLastNItemsFromMap = (map: Map<unknown, unknown>, n = 0) => {
  return map ? Array.from(map.entries()).slice(-n) : [];
};
