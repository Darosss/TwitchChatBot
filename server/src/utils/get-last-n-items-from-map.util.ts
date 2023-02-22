export const getLastNItemsFromMap = (map: Map<any, any>, n: number = 0) => {
  return map.size > 0 ? Array.from(map.entries()).slice(-n) : [];
};
