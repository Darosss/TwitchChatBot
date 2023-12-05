import ReactGridLayout from "react-grid-layout";

const defaultsLayoutOpts = {
  isDraggable: false,
  isResizable: false,
  static: false,
};

export interface OverlayKeysType {
  overlayRedemptions: string;
  overlayMusicPlayer: string;
  overlayYoutubeMusicPlayer: string;
  overlayAchievements: string;
  overlayChat: string;
}
interface StyleParsedBase {
  background: string;
  opacity: number;
}

interface BaseCssStyles {
  color: string;
  fontSize: string;
}

interface BaseMusicStyles {
  currentSong: BaseCssStyles;
  progressBar: BaseCssStyles & {
    background: string;
    baseBackground: string;
  };
}

interface BadgeCssStyles {
  boxShadow: string;
  badgeSize: string;
}

export interface OverlayChatStyleParsed extends StyleParsedBase {
  badges: BadgeCssStyles;
  message: BaseCssStyles;
  time: BaseCssStyles;
  username: BaseCssStyles;
  boxShadow: string;
  borderRadius: string;
}
export interface OverlayYoutubeMusicPlayerStyleParsed
  extends StyleParsedBase,
    BaseMusicStyles {
  boxShadow: string;
  borderRadius: string;
}

export interface BaseOverlayAchievementsRarity {
  usernameColor: BaseCssStyles["color"];
  textColor: BaseCssStyles["color"];
  achievementNameColor: BaseCssStyles["color"];
  stagesNameColor: BaseCssStyles["color"];
  goalColor: BaseCssStyles["color"];
  timestampColor: BaseCssStyles["color"];
  badgeBoxShadow: BadgeCssStyles["boxShadow"];
  background: string;
  boxShadow: string;
  opacity: number;
}
interface OverlayAchievementsRarities {
  rarity1: BaseOverlayAchievementsRarity;
  rarity2: BaseOverlayAchievementsRarity;
  rarity3: BaseOverlayAchievementsRarity;
  rarity4: BaseOverlayAchievementsRarity;
  rarity5: BaseOverlayAchievementsRarity;
  rarity6: BaseOverlayAchievementsRarity;
  rarity7: BaseOverlayAchievementsRarity;
  rarity8: BaseOverlayAchievementsRarity;
  rarity9: BaseOverlayAchievementsRarity;
}

interface OverlayAchievementsQueueStyles
  extends BaseCssStyles,
    StyleParsedBase {
  boxShadow: string;
  borderRadius: string;
}

export interface OverlayAchievementsStyleParsed
  extends StyleParsedBase,
    OverlayAchievementsRarities {
  queue: OverlayAchievementsQueueStyles;
  fontSize: BaseCssStyles["fontSize"];
  badgeSize: string;
  timestampFontSize: BaseCssStyles["fontSize"];
  direction: string;
  boxShadow: string;
  borderRadius: string;
}

export interface OverlayRedemptionsStyleParsed extends StyleParsedBase {
  imageSize: string;
  fontSize: BaseCssStyles["fontSize"];
  borderRadius: string;
  boxShadow: string;
}
export interface OverlayMusicPlayerStyleParsed
  extends StyleParsedBase,
    BaseMusicStyles {
  boxShadow: string;
  borderRadius: string;
}

export interface OverlayKeysStylesParsedType {
  overlayRedemptions: OverlayRedemptionsStyleParsed;
  overlayMusicPlayer: OverlayMusicPlayerStyleParsed;
  overlayYoutubeMusicPlayer: OverlayYoutubeMusicPlayerStyleParsed;
  overlayAchievements: OverlayAchievementsStyleParsed;
  overlayChat: OverlayChatStyleParsed;
}

export const overlaysKeys: OverlayKeysType = {
  overlayRedemptions: "overlay-redemptions",
  overlayMusicPlayer: "overlay-music-player",
  overlayYoutubeMusicPlayer: "overlay-youtube-music-player",
  overlayAchievements: "overlay-achievements",
  overlayChat: "overlay-chat",
};

const initialOverlayChatStyles: OverlayChatStyleParsed = {
  background: "lightblue",
  boxShadow: "1px 2px 3px 4px lightblue",
  borderRadius: "0.5rem",
  opacity: 100,
  badges: { boxShadow: "1px 1px 5px 1px blue", badgeSize: "18px" },
  time: { color: "white", fontSize: "80%" },
  username: { color: "red", fontSize: "80%" },
  message: { color: "black", fontSize: "80%" },
};

const initialOverlayYoutubeMusicPlayerStyles: OverlayYoutubeMusicPlayerStyleParsed =
  {
    background: "lightblue",
    opacity: 100,
    boxShadow: "1px 2px 4px 4px lightblue",
    borderRadius: "0.5rem",
    currentSong: { color: "black", fontSize: "80%" },
    progressBar: {
      color: "orange",
      fontSize: "80%",
      background: "blue",
      baseBackground: "white",
    },
  };

const initialRaritiesStyles: OverlayAchievementsRarities = {
  rarity1: {
    background:
      "linear-gradient(57deg, rgba(82, 83, 99, 1) 0%, rgba(42, 42, 47, 1) 24%, rgba(43, 43, 57, 1) 52%, rgba(26, 26, 53, 1) 78%)",
    achievementNameColor: "white",
    badgeBoxShadow: "1px 2px 3px 4px rgba(82, 83, 99, 1)",
    goalColor: "#DEB887",
    stagesNameColor: "#DEB887",
    textColor: "white",
    usernameColor: "#DEB887",
    timestampColor: "#DEB887",
    boxShadow: "1px 2px 4px 4px rgba(82, 83, 99, 1)",
    opacity: 100,
  },

  rarity2: {
    background:
      "linear-gradient(57deg, rgba(47, 62, 92, 1) 0%, rgba(33, 44, 105, 1) 22%, rgba(15, 32, 62, 1) 52%, rgba(33, 47, 33, 1) 87%)",
    achievementNameColor: "white",
    badgeBoxShadow: "1px 2px 3px 4px rgba(47, 62, 92, 1)",
    goalColor: "#DEB887",
    stagesNameColor: "#DEB887",
    textColor: "white",
    usernameColor: "#DEB887",
    timestampColor: "#DEB887",
    boxShadow: "1px 2px 4px 4px rgba(47, 62, 92, 1)",
    opacity: 100,
  },
  rarity3: {
    background:
      "linear-gradient(57deg, rgba(50, 92, 47, 1) 0%, rgba(33, 105, 39, 1) 22%, rgba(28, 62, 15, 1) 52%, rgba(52, 55, 34, 1) 87%)",
    achievementNameColor: "white",
    badgeBoxShadow: "1px 2px 3px 4px rgba(50, 92, 47, 1)",
    goalColor: "#DEB887",
    stagesNameColor: "#DEB887",
    textColor: "white",
    usernameColor: "#DEB887",
    timestampColor: "#DEB887",
    boxShadow: "1px 2px 4px 4px rgba(50, 92, 47, 1)",
    opacity: 100,
  },
  rarity4: {
    background:
      "linear-gradient(57deg, rgba(90, 90, 45, 1) 0%, rgba(99, 105, 44, 1) 22%, rgba(128, 105, 18, 1) 52%, rgba(105, 63, 19, 1) 87%)",
    achievementNameColor: "white",
    badgeBoxShadow: "1px 2px 3px 4px rgba(90, 90, 45, 1)",
    goalColor: "#B0E0E6",
    stagesNameColor: "#B0E0E6",
    textColor: "white",
    usernameColor: "#B0E0E6",
    timestampColor: "#B0E0E6",
    boxShadow: "1px 2px 4px 4px rgba(90, 90, 45, 1)",
    opacity: 100,
  },
  rarity5: {
    background:
      "linear-gradient(57deg, rgba(171, 171, 90, 1) 0%, rgba(169, 179, 74, 1) 22%, rgba(210, 176, 45, 1) 52%, rgba(148, 53, 30, 1) 87%)",
    achievementNameColor: "white",
    badgeBoxShadow: "1px 2px 3px 4px rgba(171, 171, 90, 1)",
    goalColor: "#B0E0E6",
    stagesNameColor: "#B0E0E6",
    textColor: "white",
    usernameColor: "#B0E0E6",
    timestampColor: "#B0E0E6",
    boxShadow: "1px 2px 4px 4px rgba(171, 171, 90, 1)",
    opacity: 100,
  },
  rarity6: {
    background:
      "radial-gradient(circle, rgba(195, 177, 23, 1) 0%, rgba(204, 171, 36, 1) 20%, rgba(200, 128, 49, 1) 50%, rgba(189, 63, 0, 1) 100%)",
    achievementNameColor: "white",
    badgeBoxShadow: "1px 2px 3px 4px rgba(195, 177, 23, 1)",
    goalColor: "#B0E0E6",
    stagesNameColor: "#B0E0E6",
    textColor: "white",
    usernameColor: "#B0E0E6",
    timestampColor: "#B0E0E6",
    boxShadow: "1px 2px 4px 4px rgba(195, 177, 23, 1)",
    opacity: 100,
  },
  rarity7: {
    background:
      "radial-gradient(circle, rgba(255, 242, 216, 1) 1%, rgba(237, 197, 140, 1) 36%, rgba(235, 155, 68, 1) 73%, rgba(187, 156, 137, 1) 100%)",
    achievementNameColor: "white",
    badgeBoxShadow: "1px 2px 3px 4px rgba(243, 120, 5, 1)",
    goalColor: "#98FB98",
    stagesNameColor: "#98FB98",
    textColor: "white",
    usernameColor: "#98FB98",
    timestampColor: "#98FB98",
    boxShadow: "1px 2px 4px 4px rgba(243, 120, 5, 1)",
    opacity: 100,
  },
  rarity8: {
    background:
      "radial-gradient(circle, rgba(255, 122, 122, 1) 0%, rgba(255, 110, 65, 1) 56%, rgba(239, 101, 71, 1) 73%, rgba(128, 34, 23, 1) 100%)",
    achievementNameColor: "white",
    badgeBoxShadow: "1px 2px 3px 4px rgba(243, 49, 5, 1)",
    goalColor: "#98FB98",
    stagesNameColor: "#98FB98",
    textColor: "white",
    usernameColor: "#98FB98",
    timestampColor: "#98FB98",
    boxShadow: "1px 2px 4px 4px rgba(243, 49, 5, 1)",
    opacity: 100,
  },

  rarity9: {
    background:
      "radial-gradient(circle, rgba(255, 194, 194, 1) 4%, rgba(220, 207, 202, 1) 36%, rgba(212, 161, 155, 1) 73%, rgba(187, 137, 137, 1) 100%)",
    achievementNameColor: "white",
    badgeBoxShadow: "1px 2px 3px 4px rgba(150, 96, 96, 1)",
    goalColor: "#98FB98",
    stagesNameColor: "#98FB98",
    textColor: "white",
    usernameColor: "#98FB98",
    timestampColor: "#98FB98",
    boxShadow: "1px 2px 4px 4px rgba(150, 96, 96, 1)",
    opacity: 100,
  },
};

const initialOverlayAchievementsStyles: OverlayAchievementsStyleParsed = {
  background: "transparent",
  opacity: 100,
  boxShadow: "none",
  fontSize: "100%",
  badgeSize: "100%",
  direction: "column",
  timestampFontSize: ".9rem",
  borderRadius: "0.5rem",
  queue: {
    color: "black",
    fontSize: "80%",
    background: "lightblue",
    opacity: 100,
    boxShadow: "1px 2px 4px 4px lightblue",
    borderRadius: "0.5rem",
  },
  ...initialRaritiesStyles,
};
const initialOverlayMusicPlayerStyles: OverlayMusicPlayerStyleParsed = {
  background: "lightblue",
  boxShadow: "1px 2px 4px 4px lightblue",
  opacity: 100,
  borderRadius: "0.5rem",
  currentSong: { color: "black", fontSize: "80%" },
  progressBar: {
    color: "orange",
    fontSize: "80%",
    background: "blue",
    baseBackground: "white",
  },
};
const initialOverlayRedemptionsStyles: OverlayRedemptionsStyleParsed = {
  background: "transparent",
  opacity: 100,
  fontSize: "1rem",
  imageSize: "50px",
  borderRadius: ".5rem",
  boxShadow: "none",
};

export const initialStylesState: OverlayKeysStylesParsedType = {
  overlayAchievements: initialOverlayAchievementsStyles,
  overlayMusicPlayer: initialOverlayMusicPlayerStyles,
  overlayRedemptions: initialOverlayRedemptionsStyles,
  overlayYoutubeMusicPlayer: initialOverlayYoutubeMusicPlayerStyles,
  overlayChat: initialOverlayChatStyles,
};

export const stringifyOverlayKeysType = (
  data: OverlayKeysStylesParsedType
): OverlayKeysType => {
  return Object.keys(data).reduce<{
    [key in keyof OverlayKeysStylesParsedType]: string;
  }>(
    (acc, key) => {
      const keyAsOverlayKeysStylesParsedType =
        key as keyof OverlayKeysStylesParsedType;
      acc[keyAsOverlayKeysStylesParsedType] = JSON.stringify(
        data[keyAsOverlayKeysStylesParsedType]
      );
      return acc;
    },
    {
      overlayRedemptions: "",
      overlayMusicPlayer: "",
      overlayYoutubeMusicPlayer: "",
      overlayAchievements: "",
      overlayChat: "",
    }
  );
};

export const parseOverlayKeysType = (
  data: OverlayKeysType
): OverlayKeysStylesParsedType => {
  return Object.keys(data).reduce<OverlayKeysStylesParsedType>((acc, key) => {
    const keyAsOverlayKeysType = key as keyof OverlayKeysStylesParsedType;
    acc[keyAsOverlayKeysType] = JSON.parse(data[keyAsOverlayKeysType]);
    return acc;
  }, initialStylesState);
};

// prettier-ignore
export const initialLayoutOverlays: ReactGridLayout.Layouts = {
  ulg: [
    { i: overlaysKeys.overlayRedemptions, x: 0, y: 15, w: 20, h: 25, ...defaultsLayoutOpts },
    { i: overlaysKeys.overlayMusicPlayer, x: 6, y: 0, w: 25, h: 5, ...defaultsLayoutOpts },
    { i: overlaysKeys.overlayYoutubeMusicPlayer, x: 6, y: 10, w: 30, h: 30, ...defaultsLayoutOpts },
    { i: overlaysKeys.overlayAchievements, x: 6, y: 10, w: 30, h: 30, ...defaultsLayoutOpts },
    { i: overlaysKeys.overlayChat, x: 6, y: 10, w: 30, h: 30, ...defaultsLayoutOpts },
  ],
  lg: [
    { i: overlaysKeys.overlayRedemptions, x: 0, y: 15, w: 20, h: 25, ...defaultsLayoutOpts },
    { i: overlaysKeys.overlayMusicPlayer, x: 6, y: 0, w: 25, h: 5, ...defaultsLayoutOpts },
    { i: overlaysKeys.overlayYoutubeMusicPlayer, x: 6, y: 10, w: 25, h: 25, ...defaultsLayoutOpts },
    { i: overlaysKeys.overlayAchievements, x: 6, y: 10, w: 25, h: 25, ...defaultsLayoutOpts },
    { i: overlaysKeys.overlayChat, x: 6, y: 10, w: 25, h: 25, ...defaultsLayoutOpts },
  ],
  md: [
    { i: overlaysKeys.overlayRedemptions, x: 0, y: 15, w: 20, h: 25, ...defaultsLayoutOpts },
    { i: overlaysKeys.overlayMusicPlayer, x: 6, y: 0, w: 25, h: 5, ...defaultsLayoutOpts },
    { i: overlaysKeys.overlayYoutubeMusicPlayer, x: 6, y: 10, w: 15, h: 15, ...defaultsLayoutOpts },
    { i: overlaysKeys.overlayAchievements, x: 6, y: 10, w: 15, h: 15, ...defaultsLayoutOpts },
    { i: overlaysKeys.overlayChat, x: 6, y: 10, w: 15, h: 15, ...defaultsLayoutOpts },
  ],
  sm: [
    { i: overlaysKeys.overlayRedemptions, x: 0, y: 15, w: 20, h: 25, ...defaultsLayoutOpts },
    { i: overlaysKeys.overlayMusicPlayer, x: 6, y: 0, w: 25, h: 5, ...defaultsLayoutOpts },
    { i: overlaysKeys.overlayYoutubeMusicPlayer, x: 6, y: 10, w: 15, h: 15, ...defaultsLayoutOpts },
    { i: overlaysKeys.overlayAchievements, x: 6, y: 10, w: 15, h: 15, ...defaultsLayoutOpts },
    { i: overlaysKeys.overlayChat, x: 6, y: 10, w: 15, h: 15, ...defaultsLayoutOpts },
  ],
  xs: [
    { i: overlaysKeys.overlayRedemptions, x: 0, y: 15, w: 20, h: 25, ...defaultsLayoutOpts },
    { i: overlaysKeys.overlayMusicPlayer, x: 6, y: 0, w: 25, h: 5, ...defaultsLayoutOpts },
    { i: overlaysKeys.overlayYoutubeMusicPlayer, x: 6, y: 10, w: 10, h: 10, ...defaultsLayoutOpts },
    { i: overlaysKeys.overlayAchievements, x: 6, y: 10, w: 10, h: 10, ...defaultsLayoutOpts },
    { i: overlaysKeys.overlayChat, x: 6, y: 10, w: 10, h: 10, ...defaultsLayoutOpts },
  ],
  xxs: [
    { i: overlaysKeys.overlayRedemptions, x: 0, y: 15, w: 20, h: 25, ...defaultsLayoutOpts },
    { i: overlaysKeys.overlayMusicPlayer, x: 0, y: 5, w: 15, h: 5, ...defaultsLayoutOpts },
    { i: overlaysKeys.overlayYoutubeMusicPlayer, x: 6, y: 10, w: 5, h: 5, ...defaultsLayoutOpts },
    { i: overlaysKeys.overlayAchievements, x: 6, y: 10, w: 5, h: 5, ...defaultsLayoutOpts },
    { i: overlaysKeys.overlayChat, x: 6, y: 10, w: 5, h: 5, ...defaultsLayoutOpts },
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
