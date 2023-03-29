import ReactGridLayout from "react-grid-layout";

export const initialLayoutWidgets: ReactGridLayout.Layouts = {
  ulg: [
    { i: "stream-chat", x: 0, y: 0, w: 2, h: 12, static: true },
    { i: "stream-chatters", x: 2, y: 0, w: 2, h: 12, static: true },
    { i: "stream-notifications", x: 5, y: 0, w: 4, h: 12, static: true },
    { i: "stream-statistics", x: 11, y: 0, w: 7, h: 15, static: true },
    { i: "messages-window", x: 4, y: 0, w: 2, h: 10, static: true },
    { i: "stream-modes", x: 6, y: 0, w: 3, h: 10, static: true },
  ],
  lg: [
    { i: "stream-chat", x: 0, y: 0, w: 3, h: 12, static: true },
    { i: "stream-chatters", x: 0, y: 12, w: 3, h: 10, static: true },
    { i: "stream-notifications", x: 8, y: 0, w: 4, h: 10, static: true },
    { i: "stream-statistics", x: 4, y: 10, w: 8, h: 12, static: true },
    { i: "messages-window", x: 3, y: 0, w: 2, h: 10, static: true },
    { i: "stream-modes", x: 5, y: 0, w: 3, h: 10, static: true },
  ],
  md: [
    { i: "stream-chat", x: 0, y: 0, w: 2, h: 10, static: true },
    { i: "stream-chatters", x: 8, y: 0, w: 2, h: 10, static: true },
    { i: "stream-notifications", x: 6, y: 10, w: 4, h: 8, static: true },
    { i: "stream-statistics", x: 0, y: 10, w: 6, h: 8, static: true },
    { i: "messages-window", x: 4, y: 0, w: 2, h: 10, static: true },
    { i: "stream-modes", x: 2, y: 0, w: 2, h: 10, static: true },
  ],
  sm: [
    { i: "stream-chat", x: 0, y: 0, w: 2, h: 8, static: true },
    { i: "stream-chatters", x: 2, y: 0, w: 1, h: 8, static: true },
    { i: "stream-notifications", x: 4, y: 8, w: 4, h: 8, static: true },
    { i: "stream-statistics", x: 0, y: 8, w: 2, h: 8, static: true },
    { i: "messages-window", x: 3, y: 0, w: 1, h: 8, static: true },
    { i: "stream-modes", x: 6, y: 0, w: 2, h: 8, static: true },
  ],
  xs: [
    { i: "stream-chat", x: 0, y: 0, w: 2, h: 6, static: true },
    { i: "stream-chatters", x: 2, y: 0, w: 2, h: 5, static: true },
    { i: "stream-notifications", x: 4, y: 0, w: 2, h: 5, static: true },
    { i: "stream-statistics", x: 0, y: 12, w: 1, h: 1, static: true },
    { i: "messages-window", x: 3, y: 0, w: 2, h: 4, static: true },
    { i: "stream-modes", x: 0, y: 6, w: 2, h: 3, static: true },
  ],
  xxs: [
    { i: "stream-chat", x: 0, y: 0, w: 3, h: 5, static: true },
    { i: "stream-chatters", x: 3, y: 0, w: 2, h: 5, static: true },
    { i: "stream-notifications", x: 0, y: 4, w: 4, h: 5, static: true },
    { i: "stream-statistics", x: 2, y: 0, w: 7, h: 5, static: true },
    { i: "messages-window", x: 3, y: 0, w: 3, h: 4, static: true },
    { i: "stream-modes", x: 5, y: 0, w: 3, h: 10, static: true },
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
