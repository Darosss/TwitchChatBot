export interface OverlayKeysType {
  overlayRedemptions: string;
  overlayMusicPlayer: string;
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
export interface OverlayRequestsStyle extends BaseCssStyles {
  boxShadow: string;
  headerFontSize: string;
  nicknameColor: string;
  background: string;
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
export interface OverlayAchievementsRarities {
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
  requests: OverlayRequestsStyle;
}

export interface OverlayKeysStylesParsedType {
  overlayRedemptions: OverlayRedemptionsStyleParsed;
  overlayMusicPlayer: OverlayMusicPlayerStyleParsed;
  overlayAchievements: OverlayAchievementsStyleParsed;
  overlayChat: OverlayChatStyleParsed;
}
