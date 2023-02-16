import useAxiosCustom, { IPagination } from "./Api.service";

export interface ITwitchSession {
  _id: string;
  sessionStart: Date;
  sessionEnd: Date;
  sessionTitles: string[];
  categories: string[];
  tags: string[];
}

const getSessions = () => {
  return useAxiosCustom<IPagination<ITwitchSession>>({
    url: `/twitch-sessions`,
  });
};

export default { getSessions };
