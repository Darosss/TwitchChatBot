import { BaseModelProperties, DefaultRequestParams } from "../api";
import { Mood } from "../moods";
import { Tag } from "../tags";

export interface ChatCommand extends BaseModelProperties {
  name: string;
  description?: string;
  enabled: boolean;
  uses: number;
  aliases: string[];
  messages: string[];
  privilege: number;
  useCount: number;
  tag: Tag;
  mood: Mood;
}

export interface ChatCommandCreateData
  extends Omit<
    ChatCommand,
    "_id" | "createdAt" | "updatedAt" | "useCount" | "tag" | "mood" | "uses"
  > {
  tag: string;
  mood: string;
}

export interface ChatCommandUpdateData extends Partial<ChatCommandCreateData> {}

export interface FetchChatCommandParams
  extends DefaultRequestParams<keyof ChatCommand> {
  search_name?: string;
  end_date?: string;
  start_date?: string;
  privilege?: string;
  aliases?: string;
  description?: string;
  messages?: string;
}
