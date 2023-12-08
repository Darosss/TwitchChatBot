import { BaseModelProperties } from "../api";

export interface Mood extends BaseModelProperties {
  name: string;
  enabled: boolean;
  prefixes: string[];
  sufixes: string[];
}

export interface MoodCreateData
  extends Pick<Mood, "name" | "prefixes" | "sufixes"> {}

export interface MoodUpdateData extends Partial<MoodCreateData> {
  enabled?: boolean;
}
