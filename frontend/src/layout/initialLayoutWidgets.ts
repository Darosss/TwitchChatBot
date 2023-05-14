import ReactGridLayout from "react-grid-layout";

const defaultsLayoutOpts = {
  isDraggable: false,
  isResizable: false,
  static: false,
};

export const widgetsKeys = {
  streamChat: "stream-chat",
  streamChatters: "stream-chatters",
  streamNotifications: "stream-notifications",
  streamStatistics: "stream-statistics",
  messagesWindow: "messages-window",
  rewardsWindow: "rewards-window",
  streamModes: "stream-modes",
  musicPlayer: "music-player",
};

// prettier-ignore
export const initialLayoutWidgets: ReactGridLayout.Layouts = {
  ulg: [
    {i: widgetsKeys.streamChat, x: 0, y: 0, w: 15, h: 60, ...defaultsLayoutOpts },
    {i: widgetsKeys.streamChatters, x: 15, y: 0, w: 10, h: 25, ...defaultsLayoutOpts },
    {i: widgetsKeys.streamNotifications, x: 75, y: 0,  w: 25, h: 25, ...defaultsLayoutOpts },
    {i: widgetsKeys.streamStatistics, x: 15, y: 25, w: 85, h: 35, ...defaultsLayoutOpts},
    {i: widgetsKeys.messagesWindow, x: 25, y: 0, w: 10, h: 25, ...defaultsLayoutOpts },
    {i: widgetsKeys.rewardsWindow, x: 62, y: 0, w: 14, h: 25, ...defaultsLayoutOpts },
    {i: widgetsKeys.streamModes, x: 35, y: 0, w: 15, h: 25, ...defaultsLayoutOpts },
    {i: widgetsKeys.musicPlayer, x: 50, y: 0, w: 12, h: 25, ...defaultsLayoutOpts },
  ],
  lg: [
    { i: widgetsKeys.streamChat, x: 0, y: 0, w: 20, h: 25, ...defaultsLayoutOpts },
    { i: widgetsKeys.streamChatters, x: 20, y: 0, w: 15, h: 25, ...defaultsLayoutOpts }, 
    { i: widgetsKeys.streamNotifications, x: 70, y: 0, w: 30, h: 25, ...defaultsLayoutOpts },
    { i: widgetsKeys.streamStatistics, x: 20, y: 25, w: 60, h: 30, ...defaultsLayoutOpts },
    { i: widgetsKeys.messagesWindow, x: 35, y: 0, w: 15, h: 25, ...defaultsLayoutOpts },
    { i: widgetsKeys.rewardsWindow, x: 80, y: 25, w: 20, h: 30, ...defaultsLayoutOpts },
    { i: widgetsKeys.streamModes, x: 50, y: 0, w: 20, h: 25, ...defaultsLayoutOpts },
    { i: widgetsKeys.musicPlayer, x: 0, y: 25, w: 20, h: 30, ...defaultsLayoutOpts },
  ],
  md: [
    { i: widgetsKeys.streamChat, x: 0, y: 0, w: 15, h: 30, ...defaultsLayoutOpts },
     { i: widgetsKeys.streamChatters, x: 15, y: 15, w: 15, h: 15, ...defaultsLayoutOpts },
     { i: widgetsKeys.streamNotifications, x: 60, y: 0, w: 25, h: 30, ...defaultsLayoutOpts },
     { i: widgetsKeys.streamStatistics, x: 0, y: 30, w: 60, h: 22, ...defaultsLayoutOpts },
     { i: widgetsKeys.messagesWindow, x: 15, y: 0, w: 15, h: 15, ...defaultsLayoutOpts },
     { i: widgetsKeys.rewardsWindow, x: 60, y: 30, w: 20, h: 22, ...defaultsLayoutOpts },
     { i: widgetsKeys.streamModes, x: 30, y: 0, w: 25, h: 15, ...defaultsLayoutOpts },
     { i: widgetsKeys.musicPlayer, x: 30, y: 15, w: 25, h: 15, ...defaultsLayoutOpts },

  ],
  sm: [
    { i: widgetsKeys.streamChat, x: 0, y: 0, w: 15, h: 40, ...defaultsLayoutOpts },
     { i: widgetsKeys.streamChatters, x: 15, y: 25, w: 15, h: 15, ...defaultsLayoutOpts },
     { i: widgetsKeys.streamNotifications, x: 30, y: 0, w: 30, h: 15, ...defaultsLayoutOpts },
     { i: widgetsKeys.streamStatistics, x: 0, y: 40, w: 40, h: 30, ...defaultsLayoutOpts },
     { i: widgetsKeys.messagesWindow, x: 15, y: 0, w: 15, h: 25, ...defaultsLayoutOpts },
     { i: widgetsKeys.rewardsWindow, x: 60, y: 40, w: 20, h: 30, ...defaultsLayoutOpts },
     { i: widgetsKeys.streamModes, x: 45, y: 15, w: 15, h: 25, ...defaultsLayoutOpts },
     { i: widgetsKeys.musicPlayer, x: 30, y: 15, w: 15, h: 25, ...defaultsLayoutOpts },

  ],
  xs: [
    { i: widgetsKeys.streamChat, x: 0, y: 0, w: 10, h: 20, ...defaultsLayoutOpts },
     { i: widgetsKeys.streamChatters, x: 10, y: 10, w: 10, h: 10, ...defaultsLayoutOpts },
     { i: widgetsKeys.streamNotifications, x: 28, y: 0, w: 12, h: 20, ...defaultsLayoutOpts },
     { i: widgetsKeys.streamStatistics, x: 10, y: 20, w: 30, h: 25, ...defaultsLayoutOpts },
     { i: widgetsKeys.messagesWindow, x: 10, y: 0, w: 10, h: 10, ...defaultsLayoutOpts },
     { i: widgetsKeys.rewardsWindow, x: 0, y: 35, w: 10, h: 15, ...defaultsLayoutOpts },
     { i: widgetsKeys.streamModes, x: 20, y: 0, w: 8, h: 20, ...defaultsLayoutOpts },
     { i: widgetsKeys.musicPlayer, x: 0, y: 20, w: 10, h: 15, ...defaultsLayoutOpts },

  ],
  xxs: [
    { i: widgetsKeys.streamChat, x: 0, y: 0, w: 10, h: 15, ...defaultsLayoutOpts },
     { i: widgetsKeys.streamChatters, x: 10, y: 8, w: 10, h: 7, ...defaultsLayoutOpts },
     { i: widgetsKeys.streamNotifications, x: 15, y: 30, w: 10, h: 25, ...defaultsLayoutOpts },
     { i: widgetsKeys.streamStatistics, x: 0, y: 30, w: 10, h: 5, ...defaultsLayoutOpts },
     { i: widgetsKeys.messagesWindow, x: 10, y: 0, w: 10, h: 8, ...defaultsLayoutOpts },
     { i: widgetsKeys.rewardsWindow, x: 0, y: 35, w: 10, h: 15, ...defaultsLayoutOpts },
     { i: widgetsKeys.streamModes, x: 0, y: 15, w: 10, h: 15, ...defaultsLayoutOpts },
     { i: widgetsKeys.musicPlayer, x: 15, y: 15, w: 10, h: 15, ...defaultsLayoutOpts },

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
