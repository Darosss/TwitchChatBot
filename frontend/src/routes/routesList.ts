type RoutesType = {
  path: string;
  label: string;
  description: string;
};

export const routes: RoutesType[] = [
  { path: "/", label: "Home", description: "Home site" },
  {
    path: "/achievements",
    label: "Achievements",
    description: `A place where you can modify, edit, create achievements. 
These are obtainable moslty by watching stream, chatting on stream and more`,
  },
  {
    path: "/overlay",
    label: "Overlay",
    description: `A place where you can create and modify your own overlays.
Choose from: chat, rewards, music player, achievements box and more`,
  },
  {
    path: "/messages",
    label: "Messages",
    description: "All messages from your stream sessions.",
  },
  {
    path: "/message-categories",
    label: "Message categories",
    description:
      "Message categories - which can be send by bot depends on % set in configs. ",
  },
  {
    path: "/users",
    label: "Users",
    description: "Check all users that visited or were on your stream",
  },
  {
    path: "/events",
    label: "Events",
    description: `Events window - a virtual stream deck where you can: 
- manage played music
- turn on/off modes(affixes, moods, tags)
- add custom alert sounds
- check last chatters
- send messages as bot
- check stream evenets like (who join channel, who left)
- and more...`,
  },
  {
    path: "/modes",
    label: "Modes",
    description: `Manage default or created by your own affixes, tags, moods`,
  },
  {
    path: "/stream-sessions",
    label: "Sessions",
    description:
      "Here you can check stream session that you already finished or are currently active",
  },
  {
    path: "/songs",
    label: "Songs",
    description: "A whole songs collected by playing through music yt player",
  },
  {
    path: "/redemptions",
    label: "Redemptions",
    description: "Contains all redemptions from twitch channel points",
  },
  {
    path: "/commands",
    label: "Commands",
    description: "Modify, create, delete your own chat commands",
  },
  {
    path: "/triggers",
    label: "Triggers",
    description: "Modify, create, delete your own chat triggers",
  },
  {
    path: "/timers",
    label: "Timers",
    description: "Modify, create, delete your own chat timers",
  },
  {
    path: "/configs",
    label: "Configs",
    description: `Change bot configs fe.:
- checking interval of modes
- permission levels
- mode suffix, prefix chances
- song request
- and more`,
  },
];
