import { BaseModelProperties } from "../api";
import { Mood } from "../moods";
import { Tag } from "../tags";

export type TriggerMode = "WHOLE-WORD" | "STARTS-WITH" | "ALL";

export interface Trigger extends BaseModelProperties {
  name: string;
  enabled: boolean;
  chance: number;
  delay: number;
  uses: number;
  mode: TriggerMode;
  onDelay: boolean;
  words: string[];
  messages: string[];
  tag: Tag;
  mood: Mood;
}

export interface TriggerCreateData
  extends Omit<
    Trigger,
    "_id" | "createdAt" | "updatedAt" | "onDelay" | "uses" | "tag" | "mood"
  > {
  tag: string;
  mood: string;
}

export interface TriggerUpdateData extends Partial<TriggerCreateData> {}
