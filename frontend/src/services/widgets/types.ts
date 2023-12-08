import { BaseModelProperties } from "../api";

export interface Widgets extends BaseModelProperties {
  name: string;
  layout: ReactGridLayout.Layouts;
  toolbox: ReactGridLayout.Layouts;
}

export interface WidgetsCreateData
  extends Pick<Widgets, "name" | "layout" | "toolbox"> {}

export interface WidgetsUpdateData extends Partial<WidgetsCreateData> {}
