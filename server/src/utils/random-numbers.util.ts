const randomWithMax = (max: number) => {
  return Math.floor(Math.random() * max);
};

const percentChance = (percent: number) => {
  const ran = Math.random() * 100;
  if (ran <= percent) return true;

  return false;
};

export { randomWithMax, percentChance };
