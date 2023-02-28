import useAxiosCustom, { IPagination } from "./Api.service";

export interface IConfig {
  _id: string;
  commandsPrefix: string;
  timersIntervalDelay: number;
  activeUserTimeDelay: number;
  chatGamesIntervalDelay: number;
  minActiveUsersThreshold: number;
  permissionLevels: {
    broadcaster: number;
    mod: number;
    vip: number;
    all: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const getConfigs = () => {
  return useAxiosCustom<IConfig>({
    url: `/configs`,
  });
};

const editConfig = (data: Partial<IConfig>) => {
  return useAxiosCustom<IConfig>({
    url: `/configs/edit`,
    method: "POST",
    bodyData: data,
    manual: true,
  });
};

export default { getConfigs, editConfig };
