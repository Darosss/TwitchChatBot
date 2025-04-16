import { BaseModelProperties, DefaultRequestParams } from "../api";

export interface Mood extends BaseModelProperties {
  name: string;
  enabled: boolean;
  prefixes: string[];
  sufixes: string[];
}

export interface MoodCreateData
  extends Pick<Mood, "name" | "enabled" | "prefixes" | "sufixes"> {}

export interface MoodUpdateData extends Partial<MoodCreateData> {
  enabled?: boolean;
}

export interface FetchMoodParams extends DefaultRequestParams<keyof Mood> {
  search_name?: string;
}
