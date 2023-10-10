import React, { useContext, useReducer } from "react";
import {
  ConfigsContextType,
  ConfigsDispatchAction,
  ConfigsDispatchActionType,
} from "./types";
import { configsInitialState } from "./initialState";
import { ConfigUpdateData } from "@services/ConfigService";

export const ConfigsContext = React.createContext<ConfigsContextType | null>(
  null
);

export const ConfigsContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const [configState, dispatchConfigState] = useReducer(
    configsListReducer,
    configsInitialState
  );

  return (
    <ConfigsContext.Provider
      value={{ configState: [configState, dispatchConfigState] }}
    >
      {children}
    </ConfigsContext.Provider>
  );
};

export const useConfigsContext = (): Required<ConfigsContextType> => {
  const configsContext = useContext(ConfigsContext);

  if (!configsContext) {
    throw new Error(
      "useConfigsContext must be used within a ConfigsContextProvider"
    );
  }
  return configsContext as ConfigsContextType;
};

function configsListReducer(
  state: ConfigUpdateData,
  action: ConfigsDispatchAction
): ConfigUpdateData {
  switch (action.type) {
    case ConfigsDispatchActionType.SET_COMMANDS:
      return { ...state, commandsConfigs: action.payload };
    case ConfigsDispatchActionType.SET_TIMERS:
      return { ...state, timersConfigs: action.payload };
    case ConfigsDispatchActionType.SET_TRIGGERS:
      return { ...state, triggersConfigs: action.payload };
    case ConfigsDispatchActionType.SET_CHAT_GAMES:
      return { ...state, chatGamesConfigs: action.payload };
    case ConfigsDispatchActionType.SET_POINTS:
      return { ...state, pointsConfigs: action.payload };
    case ConfigsDispatchActionType.SET_LOYALTY:
      return { ...state, loyaltyConfigs: action.payload };
    case ConfigsDispatchActionType.SET_MUSIC:
      return { ...state, musicConfigs: action.payload };
    case ConfigsDispatchActionType.SET_HEAD:
      return { ...state, headConfigs: action.payload };
    case ConfigsDispatchActionType.SET_STATE:
      return { ...action.payload };

    default:
      throw new Error("Invalid action type");
  }
}
