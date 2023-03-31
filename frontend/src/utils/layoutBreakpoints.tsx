export const getInitialCurrentBreakpoint = () => {
  const width = window.innerWidth;
  if (width >= 1700) return "ulg";
  else if (width >= 1200) return "lg";
  else if (width >= 996) return "md";
  else if (width >= 768) return "sm";
  else if (width >= 480) return "xs";
  else return "xxs";
};

export const getDefaultBreakpoints = {
  ulg: 1700,
  lg: 1200,
  md: 996,
  sm: 768,
  xs: 480,
  xxs: 200,
};

export const getDefaultCols = {
  ulg: 16,
  lg: 12,
  md: 10,
  sm: 6,
  xs: 4,
  xxs: 2,
};
