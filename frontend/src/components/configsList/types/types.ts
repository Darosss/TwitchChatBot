import {
  ChatGamesConfigs,
  CommandsConfigs,
  ConfigUpdateData,
  HeadConfigs,
  LoyaltyConfigs,
  MusicConfigs,
  PointsConfigs,
  TimersConfigs,
  TriggersConfigs,
} from "@services/ConfigService";

export type ConfigsDispatchAction =
  | { type: ConfigsDispatchActionType.SET_COMMANDS; payload: CommandsConfigs }
  | { type: ConfigsDispatchActionType.SET_TIMERS; payload: TimersConfigs }
  | { type: ConfigsDispatchActionType.SET_TRIGGERS; payload: TriggersConfigs }
  | {
      type: ConfigsDispatchActionType.SET_CHAT_GAMES;
      payload: ChatGamesConfigs;
    }
  | { type: ConfigsDispatchActionType.SET_POINTS; payload: PointsConfigs }
  | { type: ConfigsDispatchActionType.SET_LOYALTY; payload: LoyaltyConfigs }
  | { type: ConfigsDispatchActionType.SET_MUSIC; payload: MusicConfigs }
  | { type: ConfigsDispatchActionType.SET_HEAD; payload: HeadConfigs }
  | { type: ConfigsDispatchActionType.SET_STATE; payload: ConfigUpdateData };

export interface ConfigsContextType {
  configState: [ConfigUpdateData, React.Dispatch<ConfigsDispatchAction>];
}

export interface ConfigsWrapperSharedProps {
  showEdit: boolean;
}

export enum ConfigsDispatchActionType {
  SET_COMMANDS,
  SET_TIMERS,
  SET_TRIGGERS,
  SET_CHAT_GAMES,
  SET_POINTS,
  SET_LOYALTY,
  SET_MUSIC,
  SET_HEAD,
  SET_STATE,
}
