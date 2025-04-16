import { createSlice, PayloadAction } from "@reduxjs/toolkit";
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
} from "@services";

export interface ConfigsSliceType {
  config: ConfigUpdateData;
  isUpdateMode: boolean;
}

const initialState: ConfigsSliceType = {
  config: {
    commandsConfigs: {
      commandsPrefix: "",
    },
    timersConfigs: {
      timersIntervalDelay: 0,
      nonFollowTimerPoints: 0,
      nonSubTimerPoints: 0,
      suffixChance: 0,
      prefixChance: 0,
    },
    chatGamesConfigs: {
      activeUserTimeDelay: 0,
      chatGamesIntervalDelay: 0,
      minActiveUsersThreshold: 0,
    },
    triggersConfigs: {
      randomMessageChance: 0,
      suffixChance: 0,
      prefixChance: 0,
    },
    pointsConfigs: {
      pointsIncrement: {
        message: 0,
        watch: 0,
        watchMultipler: 0,
      },
    },
    loyaltyConfigs: { intervalCheckChatters: 0 },
    musicConfigs: {
      songRequest: false,
      maxAutoQueSize: 0,
      maxSongRequestByUser: 0,
    },
    headConfigs: {
      permissionLevels: {
        broadcaster: 0,
        mod: 0,
        vip: 0,
        all: 0,
      },
      intervalCheckViewersPeek: 0,
      delayBetweenMessages: { min: 0, max: 0 },
    },
  },
  isUpdateMode: false,
};

type CommandConfigPayload<K extends keyof CommandsConfigs> = [
  K,
  CommandsConfigs[K]
];
type TimersConfigsPayload<K extends keyof TimersConfigs> = [
  K,
  TimersConfigs[K]
];
type ChatGamesConfigsPayload<K extends keyof ChatGamesConfigs> = [
  K,
  ChatGamesConfigs[K]
];
type TriggersConfigsPayload<K extends keyof TriggersConfigs> = [
  K,
  TriggersConfigs[K]
];
type PointsConfigsPayload<K extends keyof PointsConfigs> = [
  K,
  PointsConfigs[K]
];
type LoyaltyConfigsPayload<K extends keyof LoyaltyConfigs> = [
  K,
  LoyaltyConfigs[K]
];
type MusicConfigsPayload<K extends keyof MusicConfigs> = [K, MusicConfigs[K]];
type HeadConfigsPayload<K extends keyof HeadConfigs> = [K, HeadConfigs[K]];

const configsSlice = createSlice({
  name: "configs",
  initialState,
  reducers: {
    openEditMode(state) {
      state.isUpdateMode = true;
    },
    closeEditMode(state) {
      state.isUpdateMode = false;
    },
    setCommandsConfigs<K extends keyof CommandsConfigs>(
      state: ConfigsSliceType,
      action: PayloadAction<CommandConfigPayload<K>>
    ) {
      state.config.commandsConfigs = {
        ...state.config.commandsConfigs,
        [action.payload[0]]: action.payload[1],
      };
    },
    setLoyaltyConfigs<K extends keyof LoyaltyConfigs>(
      state: ConfigsSliceType,
      action: PayloadAction<LoyaltyConfigsPayload<K>>
    ) {
      state.config.loyaltyConfigs = {
        ...state.config.loyaltyConfigs,
        [action.payload[0]]: action.payload[1],
      };
    },

    setTimersConfigs<K extends keyof TimersConfigs>(
      state: ConfigsSliceType,
      action: PayloadAction<TimersConfigsPayload<K>>
    ) {
      state.config.timersConfigs = {
        ...state.config.timersConfigs,
        [action.payload[0]]: action.payload[1],
      };
    },
    setChatGamesConfigs<K extends keyof ChatGamesConfigs>(
      state: ConfigsSliceType,
      action: PayloadAction<ChatGamesConfigsPayload<K>>
    ) {
      state.config.chatGamesConfigs = {
        ...state.config.chatGamesConfigs,
        [action.payload[0]]: action.payload[1],
      };
    },
    setTriggersConfigs<K extends keyof TriggersConfigs>(
      state: ConfigsSliceType,
      action: PayloadAction<TriggersConfigsPayload<K>>
    ) {
      state.config.triggersConfigs = {
        ...state.config.triggersConfigs,
        [action.payload[0]]: action.payload[1],
      };
    },
    setPointsConfigs<K extends keyof PointsConfigs>(
      state: ConfigsSliceType,
      action: PayloadAction<PointsConfigsPayload<K>>
    ) {
      state.config.pointsConfigs = {
        ...state.config.pointsConfigs,
        [action.payload[0]]: action.payload[1],
      };
    },
    setMusicConfigs<K extends keyof MusicConfigs>(
      state: ConfigsSliceType,
      action: PayloadAction<MusicConfigsPayload<K>>
    ) {
      state.config.musicConfigs = {
        ...state.config.musicConfigs,
        [action.payload[0]]: action.payload[1],
      };
    },
    setHeadConfigs<K extends keyof HeadConfigs>(
      state: ConfigsSliceType,
      action: PayloadAction<HeadConfigsPayload<K>>
    ) {
      state.config.headConfigs = {
        ...state.config.headConfigs,
        [action.payload[0]]: action.payload[1],
      };
    },
    setConfigState(state, action: PayloadAction<ConfigUpdateData>) {
      return { config: action.payload, isUpdateMode: state.isUpdateMode };
    },
    resetConfigState(state) {
      return { ...initialState, isUpdateMode: state.isUpdateMode };
    },
    resetState() {
      return initialState;
    },
  },
});

export const {
  openEditMode,
  closeEditMode,
  setCommandsConfigs,
  setLoyaltyConfigs,
  setChatGamesConfigs,
  setHeadConfigs,
  setMusicConfigs,
  setPointsConfigs,
  setTimersConfigs,
  setTriggersConfigs,
  resetConfigState,
  resetState,
  setConfigState,
} = configsSlice.actions;

export default configsSlice.reducer;
