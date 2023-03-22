import useAxiosCustom from "./ApiService";

export interface Config {
  _id: string;
  commandsPrefix: string;
  timersIntervalDelay: number;
  activeUserTimeDelay: number;
  chatGamesIntervalDelay: number;
  minActiveUsersThreshold: number;
  intervalCheckChatters: number;
  randomMessageChance: number;
  pointsIncrement: {
    message: number;
    watch: number;
    watchMultipler: number;
  };
  intervalCheckViewersPeek: number;
  permissionLevels: {
    broadcaster: number;
    mod: number;
    vip: number;
    all: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

type ConfigUpdateData = Omit<Config, "_id" | "createdAt" | "updatedAt">;

export const getConfigs = () => {
  return useAxiosCustom<Config>({
    url: `/configs`,
  });
};

export const editConfig = (data: ConfigUpdateData) => {
  return useAxiosCustom<Config>({
    url: `/configs/edit`,
    method: "POST",
    bodyData: data,
    manual: true,
  });
};
