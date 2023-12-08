import { BaseModelProperties } from "../api";
import { Mood } from "../moods";
import { Tag } from "../tags";

export interface Timer extends BaseModelProperties {
  name: string;
  enabled: boolean;
  delay: number;
  uses: number;
  messages: string[];
  description: string;
  nonFollowMulti: boolean;
  nonSubMulti: boolean;
  reqPoints: number;
  points: number;
  tag: Tag;
  mood: Mood;
}

export interface TimerCreateData
  extends Omit<
    Timer,
    "_id" | "createdAt" | "updatedAt" | "points" | "uses" | "tag" | "mood"
  > {
  tag: string;
  mood: string;
}

export interface TimerUpdateData extends Partial<TimerCreateData> {}
