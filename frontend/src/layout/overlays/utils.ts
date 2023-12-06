import { initialStylesState } from "./layoutStyles";
import { OverlayKeysStylesParsedType, OverlayKeysType } from "./types";

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
