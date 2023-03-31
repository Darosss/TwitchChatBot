import ReactGridLayout from "react-grid-layout";

export const initialLayoutOverlays: ReactGridLayout.Layouts = {
  ulg: [{ i: "overlay-redemptions", x: 0, y: 0, w: 6, h: 5, static: true }],
  lg: [{ i: "overlay-redemptions", x: 0, y: 0, w: 3, h: 5, static: true }],
  md: [{ i: "overlay-redemptions", x: 0, y: 0, w: 2, h: 10, static: true }],
  sm: [{ i: "overlay-redemptions", x: 0, y: 0, w: 2, h: 8, static: true }],
  xs: [{ i: "overlay-redemptions", x: 0, y: 0, w: 2, h: 6, static: true }],
  xxs: [{ i: "overlay-redemptions", x: 0, y: 0, w: 3, h: 5, static: true }],
};

export const initialToolboxOverlays: ReactGridLayout.Layouts = {
  ulg: [],
  lg: [],
  md: [],
  sm: [],
  xs: [],
  xxs: [],
};
