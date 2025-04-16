import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TimerCreateData } from "@services";
import { CommonSliceTypeFields } from "./types";

export type TimersSliceType = CommonSliceTypeFields<"timer", TimerCreateData>;

const initialState: TimersSliceType = {
  timer: {
    name: "",
    enabled: true,
    tag: "",
    mood: "",
    delay: 0,
    messages: [],
    description: "",
    nonFollowMulti: false,
    nonSubMulti: false,
    reqPoints: 0,
  },
  isModalOpen: false,
};

const timersSlice = createSlice({
  name: "timers",
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
      state.timer.name = action.payload;
    },
    setEnabled(state, action: PayloadAction<boolean>) {
      state.timer.enabled = action.payload;
    },
    setTag(state, action: PayloadAction<string>) {
      state.timer.tag = action.payload;
    },
    setMood(state, action: PayloadAction<string>) {
      state.timer.mood = action.payload;
    },
    setMessages(state, action: PayloadAction<string[]>) {
      state.timer.messages = action.payload;
    },
    setDelay(state, action: PayloadAction<number>) {
      state.timer.delay = action.payload;
    },
    setDescription(state, action: PayloadAction<string>) {
      state.timer.description = action.payload;
    },
    setNonFollowMultiplier(state, action: PayloadAction<boolean>) {
      state.timer.nonFollowMulti = action.payload;
    },
    setNonSubMultiplier(state, action: PayloadAction<boolean>) {
      state.timer.nonSubMulti = action.payload;
    },
    setRequirementPoints(state, action: PayloadAction<number>) {
      state.timer.reqPoints = action.payload;
    },

    setTimerState(state, action: PayloadAction<TimerCreateData>) {
      return { ...state, timer: action.payload };
    },
    resetTimerState(state) {
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
  setDelay,
  setMessages,
  setMood,
  setTag,
  setDescription,
  setNonFollowMultiplier,
  setNonSubMultiplier,
  setRequirementPoints,
  resetTimerState,
  resetState,
  setTimerState,
} = timersSlice.actions;

export default timersSlice.reducer;
