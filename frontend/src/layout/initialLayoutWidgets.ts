import ReactGridLayout from "react-grid-layout";

export const initialLayoutWidgets: ReactGridLayout.Layouts = {
  ulg: [
    { i: "stream-chat", x: 0, y: 0, w: 3, h: 12, static: true },
    { i: "stream-chatters", x: 3, y: 0, w: 2, h: 12, static: true },
    { i: "stream-notifications", x: 5, y: 0, w: 4, h: 12, static: true },
    { i: "stream-statistics", x: 11, y: 0, w: 7, h: 12, static: true },
    { i: "messages-window", x: 3, y: 0, w: 4, h: 7, static: true },
  ],
  lg: [
    { i: "stream-chat", x: 0, y: 0, w: 3, h: 12, static: true },
    { i: "stream-chatters", x: 6, y: 0, w: 2, h: 10, static: true },
    { i: "stream-notifications", x: 8, y: 0, w: 4, h: 10, static: true },
    { i: "stream-statistics", x: 4, y: 10, w: 8, h: 12, static: true },
    { i: "messages-window", x: 3, y: 0, w: 3, h: 10, static: true },
  ],
  md: [
    { i: "stream-chat", x: 0, y: 0, w: 3, h: 12, static: true },
    { i: "stream-chatters", x: 0, y: 12, w: 3, h: 10, static: true },
    { i: "stream-notifications", x: 3, y: 12, w: 5, h: 10, static: true },
    { i: "stream-statistics", x: 3, y: 0, w: 7, h: 12, static: true },
    { i: "messages-window", x: 3, y: 0, w: 3, h: 4, static: true },
  ],
  sm: [
    { i: "stream-chat", x: 0, y: 0, w: 2, h: 9, static: true },
    { i: "stream-chatters", x: 2, y: 0, w: 2, h: 4, static: true },
    { i: "stream-notifications", x: 4, y: 0, w: 4, h: 5, static: true },
    { i: "stream-statistics", x: 2, y: 0, w: 5, h: 8, static: true },
    { i: "messages-window", x: 3, y: 0, w: 3, h: 4, static: true },
  ],
  xs: [
    { i: "stream-chat", x: 0, y: 0, w: 3, h: 5, static: true },
    { i: "stream-chatters", x: 3, y: 0, w: 2, h: 5, static: true },
    { i: "stream-notifications", x: 0, y: 4, w: 4, h: 5, static: true },
    { i: "stream-statistics", x: 2, y: 0, w: 7, h: 5, static: true },
    { i: "messages-window", x: 3, y: 0, w: 3, h: 4, static: true },
  ],
  xxs: [
    { i: "stream-chat", x: 0, y: 0, w: 3, h: 5, static: true },
    { i: "stream-chatters", x: 3, y: 0, w: 2, h: 5, static: true },
    { i: "stream-notifications", x: 0, y: 4, w: 4, h: 5, static: true },
    { i: "stream-statistics", x: 2, y: 0, w: 7, h: 5, static: true },
    { i: "messages-window", x: 3, y: 0, w: 3, h: 4, static: true },
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
