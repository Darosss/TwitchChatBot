import { IConfig } from "@models/types";

export type TConfigPointsIncrement = IConfig["pointsIncrement"];

export interface ILoyaltyHandlerConfig
  extends Pick<IConfig, "pointsIncrement" | "intervalCheckChatters"> {}

export interface ITriggersHandlerConfigs
  extends Pick<IConfig, "randomMessageChance"> {}