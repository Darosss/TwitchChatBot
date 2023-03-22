import { ConfigModel } from "@models/types";

export type ConfigPointsIncrement = ConfigModel["pointsIncrement"];

export interface LoyaltyHandlerConfig
  extends Pick<ConfigModel, "pointsIncrement" | "intervalCheckChatters"> {}

export interface TriggersHandlerConfigs
  extends Pick<ConfigModel, "randomMessageChance"> {}
