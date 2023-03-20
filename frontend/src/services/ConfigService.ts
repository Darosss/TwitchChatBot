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

type IConfigUpdateData = Omit<IConfig, "_id" | "createdAt" | "updatedAt">;

export const getConfigs = () => {
  return useAxiosCustom<IConfig>({
    url: `/configs`,
  });
};

export const editConfig = (data: IConfigUpdateData) => {
  return useAxiosCustom<IConfig>({
    url: `/configs/edit`,
    method: "POST",
    bodyData: data,
    manual: true,
  });
};
