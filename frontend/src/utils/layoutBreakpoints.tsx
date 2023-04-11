export const getInitialCurrentBreakpoint = () => {
  const width = window.innerWidth;
  if (width >= getDefaultBreakpoints.ulg) return "ulg";
  else if (width >= getDefaultBreakpoints.lg) return "lg";
  else if (width >= getDefaultBreakpoints.md) return "md";
  else if (width >= getDefaultBreakpoints.sm) return "sm";
  else if (width >= getDefaultBreakpoints.xxs) return "xs";
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
  ulg: 100,
  lg: 100,
  md: 80,
  sm: 60,
  xs: 40,
  xxs: 20,
};
