import { BaseModelProperties } from "../api";
import { Mood } from "../moods";
import { Tag } from "../tags";

export interface MessageCategory extends BaseModelProperties {
  name: string;
  enabled: boolean;
  messages: [string, number][];
  uses: number;
  tag: Tag;
  mood: Mood;
}

export interface MessageCategoryCreateData
  extends Omit<
    MessageCategory,
    "_id" | "createdAt" | "updatedAt" | "uses" | "tag" | "mood" | "messages"
  > {
  messages: string[];
  tag: string;
  mood: string;
}

export interface MessageCategoryUpdateData
  extends Partial<MessageCategoryCreateData> {}
