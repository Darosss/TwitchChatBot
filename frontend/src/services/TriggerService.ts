import useAxiosCustom, { PaginationData } from "./ApiService";
import { Mood } from "./MoodService";
import { Personality } from "./PersonalityService";
import { Tag } from "./TagService";

export type TriggerMode = "WHOLE-WORD" | "STARTS-WITH" | "ALL";

export interface Trigger {
  _id: string;
  name: string;
  enabled: boolean;
  chance: number;
  delay: number;
  uses: number;
  mode: TriggerMode;
  onDelay: boolean;
  words: string[];
  messages: string[];
  personality: Personality;
  tag: Tag;
  mood: Mood;
  createdAt: Date;
  updatedAt: Date;
}

export interface TriggerCreateData
  extends Omit<
    Trigger,
    | "_id"
    | "createdAt"
    | "updatedAt"
    | "onDelay"
    | "uses"
    | "personality"
    | "tag"
    | "mood"
  > {
  personality: string;
  tag: string;
  mood: string;
}

interface TriggerUpdateData extends Partial<TriggerCreateData> {}

export const getTriggers = () => {
  return useAxiosCustom<PaginationData<Trigger>>({
    url: `/triggers`,
  });
};

export const editTrigger = (commandId: string, data: TriggerUpdateData) => {
  return useAxiosCustom<TriggerUpdateData>({
    url: `/triggers/${commandId}`,
    method: "POST",
    bodyData: data,
    manual: true,
  });
};

export const createTrigger = (data: TriggerCreateData) => {
  return useAxiosCustom<TriggerCreateData>({
    url: `/triggers/create`,
    method: "POST",
    bodyData: data,
    manual: true,
    urlParams: false,
  });
};

export const deleteTrigger = (triggerId: string) => {
  return useAxiosCustom<Trigger>({
    url: `/triggers/delete/${triggerId}`,
    method: "DELETE",
    manual: true,
    urlParams: false,
  });
};
