import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BadgeCreateData, BadgeModelImagesUrls } from "@services";
import { CommonSliceTypeFields } from "./types";

export type BadgesSliceType = CommonSliceTypeFields<"badge", BadgeCreateData>;

const initialState: BadgesSliceType = {
  badge: {
    name: "",
    imagesUrls: {
      x32: "",
      x64: "",
      x96: "",
      x128: "",
    },
    description: "",
  },
  isModalOpen: false,
};

const badgesSlice = createSlice({
  name: "badges",
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
      state.badge.name = action.payload;
    },
    setImagesUrls(state, action: PayloadAction<BadgeModelImagesUrls>) {
      state.badge.imagesUrls = action.payload;
    },
    setDescription(state, action: PayloadAction<string>) {
      state.badge.description = action.payload;
    },
    setBadgeState(state, action: PayloadAction<BadgeCreateData>) {
      return { ...state, badge: action.payload };
    },
    resetAffixState(state) {
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
  setDescription,
  setImagesUrls,
  resetAffixState,
  resetState,
  setBadgeState,
} = badgesSlice.actions;

export default badgesSlice.reducer;
