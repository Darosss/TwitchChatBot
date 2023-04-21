import useAxiosCustom from "./ApiService";

export interface TimersConfigs {
  timersIntervalDelay: number;
  nonFollowTimerPoints: number;
  nonSubTimerPoints: number;
  sufixChance: number;
  prefixChance: number;
}

export interface CommandsConfigs {
  commandsPrefix: string;
}

export interface ChatGamesConfigs {
  activeUserTimeDelay: number;
  chatGamesIntervalDelay: number;
  minActiveUsersThreshold: number;
}

export interface TriggersConfigs {
  randomMessageChance: number;
  sufixChance: number;
  prefixChance: number;
}
export interface MusicConfigs {
  songRequest: boolean;
  maxAutoQueSize: number;
  maxSongRequestByUser: number;
}

export interface PointsConfigs {
  pointsIncrement: {
    message: number;
    watch: number;
    watchMultipler: number;
  };
}

export interface LoyaltyConfigs {
  intervalCheckChatters: number;
}

export interface HeadConfigs {
  permissionLevels: {
    broadcaster: number;
    mod: number;
    vip: number;
    all: number;
  };
  intervalCheckViewersPeek: number;
  delayBetweenMessages: {
    min: number;
    max: number;
  };
}

export interface Config {
  _id: string;
  commandsConfigs: CommandsConfigs;
  timersConfigs: TimersConfigs;
  chatGamesConfigs: ChatGamesConfigs;
  triggersConfigs: TriggersConfigs;
  pointsConfigs: PointsConfigs;
  loyaltyConfigs: LoyaltyConfigs;
  musicConfigs: MusicConfigs;
  headConfigs: HeadConfigs;
  createdAt: Date;
  updatedAt: Date;
}

interface ConfigUpdateData
  extends Omit<Config, "_id" | "createdAt" | "updatedAt"> {}

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
