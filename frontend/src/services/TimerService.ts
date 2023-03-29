import useAxiosCustom, { PaginationData } from "./ApiService";
import { Mood } from "./MoodService";
import { Personality } from "./PersonalityService";
import { Tag } from "./TagService";

export interface Timer {
  _id: string;
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
  personality: Personality;
  tag: Tag;
  mood: Mood;
  createdAt: Date;
  updatedAt: Date;
}

export interface TimerCreateData
  extends Omit<
    Timer,
    | "_id"
    | "createdAt"
    | "updatedAt"
    | "points"
    | "uses"
    | "personality"
    | "tag"
    | "mood"
  > {
  personality: string;
  tag: string;
  mood: string;
}

interface TimerUpdateData extends Partial<TimerCreateData> {}

export const getTimers = () => {
  return useAxiosCustom<PaginationData<Timer>>({
    url: `/timers`,
  });
};

export const editTimer = (commandId: string, data: TimerUpdateData) => {
  return useAxiosCustom<TimerUpdateData>({
    url: `/timers/${commandId}`,
    method: "POST",
    bodyData: data,
    manual: true,
  });
};

export const createTimer = (data: TimerCreateData) => {
  return useAxiosCustom<TimerCreateData>({
    url: `/timers/create/`,
    method: "POST",
    bodyData: data,
    manual: true,
    urlParams: false,
  });
};

export const deleteTimer = (timerId: string) => {
  return useAxiosCustom<Timer>({
    url: `/timers/delete/${timerId}`,
    method: "DELETE",
    manual: true,
    urlParams: false,
  });
};
