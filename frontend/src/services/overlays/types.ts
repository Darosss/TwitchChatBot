import { BaseModelProperties } from "../api";

interface OverlayStylesType {
  overlayRedemptions: string;
  overlayMusicPlayer: string;
  overlayYoutubeMusicPlayer: string;
  overlayAchievements: string;
  overlayChat: string;
}
export interface Overlay extends BaseModelProperties {
  name: string;
  layout: ReactGridLayout.Layouts;
  toolbox: ReactGridLayout.Layouts;
  styles?: OverlayStylesType;
}
export interface OverlayCreateData
  extends Pick<Overlay, "name" | "layout" | "toolbox"> {}

export interface OverlaysUpdateData
  extends Partial<OverlayCreateData>,
    Pick<Overlay, "styles"> {}
