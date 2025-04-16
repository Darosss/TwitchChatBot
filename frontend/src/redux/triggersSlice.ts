import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TriggerCreateData, TriggerMode } from "@services";
import { CommonSliceTypeFields } from "./types";

export type TriggersSliceType = CommonSliceTypeFields<
  "trigger",
  TriggerCreateData
>;

const initialState: TriggersSliceType = {
  trigger: {
    name: "",
    enabled: true,
    tag: "",
    mood: "",
    chance: 0,
    delay: 0,
    mode: "ALL",
    words: [],
    messages: [],
  },
  isModalOpen: false,
};

const triggersSlice = createSlice({
  name: "triggers",
  initialState,
  reducers: {
    openModal(state) {
      state.isModalOpen = true;
    },
    closeModal(state) {
      state.isModalOpen = false;
    },
    setEditingId(state, action: PayloadAction<string>) {
      state.editingId = action.payload;
    },
    setName(state, action: PayloadAction<string>) {
      state.trigger.name = action.payload;
    },
    setEnabled(state, action: PayloadAction<boolean>) {
      state.trigger.enabled = action.payload;
    },
    setTag(state, action: PayloadAction<string>) {
      state.trigger.tag = action.payload;
    },
    setMood(state, action: PayloadAction<string>) {
      state.trigger.mood = action.payload;
    },
    setMessages(state, action: PayloadAction<string[]>) {
      state.trigger.messages = action.payload;
    },
    setMode(state, action: PayloadAction<TriggerMode>) {
      state.trigger.mode = action.payload;
    },
    setWords(state, action: PayloadAction<string[]>) {
      state.trigger.words = action.payload;
    },
    setChance(state, action: PayloadAction<number>) {
      state.trigger.chance = action.payload;
    },
    setDelay(state, action: PayloadAction<number>) {
      state.trigger.delay = action.payload;
    },
    setTriggerState(state, action: PayloadAction<TriggerCreateData>) {
      return { ...state, trigger: action.payload };
    },
    resetTriggerState(state) {
      return { ...initialState, isModalOpen: state.isModalOpen };
    },
    resetState() {
      return initialState;
    },
  },
});

export const {
  closeModal,
  openModal,
  setEditingId,
  setName,
  setEnabled,
  setChance,
  setDelay,
  setMessages,
  setMode,
  setMood,
  setTag,
  setWords,
  resetTriggerState,
  resetState,
  setTriggerState,
} = triggersSlice.actions;

export default triggersSlice.reducer;
