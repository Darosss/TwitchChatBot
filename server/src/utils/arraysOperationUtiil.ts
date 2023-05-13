export const shuffleArray = <T = unknown>(array: Array<T>) => {
  return array.sort(() => 0.5 - Math.random());
};
