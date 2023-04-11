import ReactGridLayout from "react-grid-layout";

const defaultsLayoutOpts = {
  isDraggable: false,
  isResizable: false,
  static: false,
};

export const initialLayoutOverlays: ReactGridLayout.Layouts = {
  ulg: [
    {
      i: "overlay-redemptions",
      x: 0,
      y: 15,
      w: 20,
      h: 25,
      ...defaultsLayoutOpts,
    },
    {
      i: "overlay-music-player",
      x: 6,
      y: 0,
      w: 25,
      h: 5,
      ...defaultsLayoutOpts,
    },
  ],
  lg: [
    {
      i: "overlay-redemptions",
      x: 0,
      y: 15,
      w: 20,
      h: 25,
      ...defaultsLayoutOpts,
    },
    {
      i: "overlay-music-player",
      x: 6,
      y: 0,
      w: 25,
      h: 5,
      ...defaultsLayoutOpts,
    },
  ],
  md: [
    {
      i: "overlay-redemptions",
      x: 0,
      y: 15,
      w: 20,
      h: 25,
      ...defaultsLayoutOpts,
    },
    {
      i: "overlay-music-player",
      x: 6,
      y: 0,
      w: 25,
      h: 5,
      ...defaultsLayoutOpts,
    },
  ],
  sm: [
    {
      i: "overlay-redemptions",
      x: 0,
      y: 15,
      w: 20,
      h: 25,
      ...defaultsLayoutOpts,
    },
    {
      i: "overlay-music-player",
      x: 6,
      y: 0,
      w: 25,
      h: 5,
      ...defaultsLayoutOpts,
    },
  ],
  xs: [
    {
      i: "overlay-redemptions",
      x: 0,
      y: 15,
      w: 20,
      h: 25,
      ...defaultsLayoutOpts,
    },
    {
      i: "overlay-music-player",
      x: 6,
      y: 0,
      w: 25,
      h: 5,
      ...defaultsLayoutOpts,
    },
  ],
  xxs: [
    {
      i: "overlay-redemptions",
      x: 0,
      y: 15,
      w: 20,
      h: 25,
      ...defaultsLayoutOpts,
    },
    {
      i: "overlay-music-player",
      x: 0,
      y: 5,
      w: 15,
      h: 5,
      ...defaultsLayoutOpts,
    },
  ],
};

export const initialToolboxOverlays: ReactGridLayout.Layouts = {
  ulg: [],
  lg: [],
  md: [],
  sm: [],
  xs: [],
  xxs: [],
};
