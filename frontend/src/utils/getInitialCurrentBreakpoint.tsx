export const getInitialCurrentBreakpoint = () => {
  const width = window.innerWidth;
  if (width >= 1700) return "ulg";
  else if (width >= 1200) return "lg";
  else if (width >= 996) return "md";
  else if (width >= 768) return "sm";
  else if (width >= 480) return "xs";
  else return "xxs";
};
