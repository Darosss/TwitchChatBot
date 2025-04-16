import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MoodCreateData } from "@services";
import { CommonSliceTypeFields } from "./types";

export type MoodsSliceType = CommonSliceTypeFields<"mood", MoodCreateData>;

const initialState: MoodsSliceType = {
  mood: { name: "", enabled: true, prefixes: [], sufixes: [] },
  isModalOpen: false,
};

const moodsSlice = createSlice({
  name: "moods",
  initialState,
  reducers: {
    openModal(state) {
      state.isModalOpen = true;
    },
    closeModal(state) {
      state.isModalOpen = false;
    },
    setName(state, action: PayloadAction<string>) {
      state.mood.name = action.payload;
    },
    setEditingId(state, action: PayloadAction<string>) {
      state.editingId = action.payload;
    },
    setEnabled(state, action: PayloadAction<boolean>) {
      state.mood.enabled = action.payload;
    },
    setMoodState(state, action: PayloadAction<MoodCreateData>) {
      return { ...state, mood: action.payload };
    },
    resetMoodState(state) {
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
  resetMoodState,
  resetState,
  setMoodState,
} = moodsSlice.actions;

export default moodsSlice.reducer;
