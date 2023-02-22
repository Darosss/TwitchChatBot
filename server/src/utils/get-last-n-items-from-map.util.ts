export const getLastNItemsFromMap = (map: Map<any, any>, n: number = 0) => {
  return map ? Array.from(map.entries()).slice(-n) : [];
};
