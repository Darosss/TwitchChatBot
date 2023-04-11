import ReactGridLayout from "react-grid-layout";

export const initialLayoutWidgets: ReactGridLayout.Layouts = {
  ulg: [
    { i: "stream-chat", x: 0, y: 0, w: 15, h: 60, static: true },
    { i: "stream-chatters", x: 15, y: 0, w: 10, h: 25, static: true },
    { i: "stream-notifications", x: 70, y: 0, w: 30, h: 25, static: true },
    { i: "stream-statistics", x: 15, y: 25, w: 85, h: 35, static: true },
    { i: "messages-window", x: 25, y: 0, w: 15, h: 25, static: true },
    { i: "stream-modes", x: 40, y: 0, w: 15, h: 25, static: true },
    { i: "music-player", x: 55, y: 0, w: 15, h: 25, static: true },
  ],
  lg: [
    { i: "stream-chat", x: 0, y: 0, w: 20, h: 25, static: true },
    { i: "stream-chatters", x: 20, y: 0, w: 15, h: 25, static: true },
    { i: "stream-notifications", x: 70, y: 0, w: 30, h: 25, static: true },
    { i: "stream-statistics", x: 20, y: 25, w: 80, h: 30, static: true },
    { i: "messages-window", x: 35, y: 0, w: 15, h: 25, static: true },
    { i: "stream-modes", x: 50, y: 0, w: 20, h: 25, static: true },
    { i: "music-player", x: 0, y: 25, w: 20, h: 30, static: true },
  ],
  md: [
    { i: "stream-chat", x: 0, y: 0, w: 15, h: 30, static: true },
    { i: "stream-chatters", x: 15, y: 15, w: 15, h: 15, static: true },
    { i: "stream-notifications", x: 60, y: 0, w: 25, h: 30, static: true },
    { i: "stream-statistics", x: 0, y: 30, w: 80, h: 25, static: true },
    { i: "messages-window", x: 15, y: 0, w: 15, h: 15, static: true },
    { i: "stream-modes", x: 30, y: 0, w: 25, h: 15, static: true },
    { i: "music-player", x: 30, y: 15, w: 25, h: 15, static: true },
  ],
  sm: [
    { i: "stream-chat", x: 0, y: 0, w: 15, h: 40, static: true },
    { i: "stream-chatters", x: 15, y: 25, w: 15, h: 15, static: true },
    { i: "stream-notifications", x: 30, y: 0, w: 30, h: 15, static: true },
    { i: "stream-statistics", x: 0, y: 40, w: 80, h: 30, static: true },
    { i: "messages-window", x: 15, y: 0, w: 15, h: 25, static: true },
    { i: "stream-modes", x: 45, y: 15, w: 15, h: 25, static: true },
    { i: "music-player", x: 30, y: 15, w: 15, h: 25, static: true },
  ],
  xs: [
    { i: "stream-chat", x: 0, y: 0, w: 10, h: 20, static: true },
    { i: "stream-chatters", x: 10, y: 10, w: 10, h: 10, static: true },
    { i: "stream-notifications", x: 28, y: 0, w: 12, h: 20, static: true },
    { i: "stream-statistics", x: 10, y: 20, w: 30, h: 25, static: true },
    { i: "messages-window", x: 10, y: 0, w: 10, h: 10, static: true },
    { i: "stream-modes", x: 20, y: 0, w: 8, h: 20, static: true },
    { i: "music-player", x: 0, y: 20, w: 10, h: 20, static: true },
  ],
  xxs: [
    { i: "stream-chat", x: 0, y: 0, w: 10, h: 15, static: true },
    { i: "stream-chatters", x: 10, y: 8, w: 10, h: 7, static: true },
    {
      i: "stream-notifications",
      x: 15,
      y: 30,
      w: 10,
      h: 25,
      static: true,
    },
    { i: "stream-statistics", x: 0, y: 30, w: 10, h: 20, static: true },
    { i: "messages-window", x: 10, y: 0, w: 10, h: 8, static: true },
    { i: "stream-modes", x: 0, y: 15, w: 10, h: 15, static: true },
    { i: "music-player", x: 15, y: 15, w: 10, h: 15, static: true },
  ],
};

export const initialToolboxWidgets: ReactGridLayout.Layouts = {
  ulg: [],
  lg: [],
  md: [],
  sm: [],
  xs: [],
  xxs: [],
};
