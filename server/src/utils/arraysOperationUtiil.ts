export const shuffleArray = (array: Array<any>) => {
  return array.sort((a, b) => 0.5 - Math.random());
};
