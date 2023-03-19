import useAxiosCustom from "./ApiService";

export interface IConfig {
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

export const getConfigs = () => {
  return useAxiosCustom<IConfig>({
    url: `/configs`,
  });
};

export const editConfig = (data: Partial<IConfig>) => {
  return useAxiosCustom<IConfig>({
    url: `/configs/edit`,
    method: "POST",
    bodyData: data,
    manual: true,
  });
};
