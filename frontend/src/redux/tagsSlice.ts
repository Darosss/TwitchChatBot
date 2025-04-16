import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TagCreateData } from "@services";
import { CommonSliceTypeFields } from "./types";

export type TagsSliceType = CommonSliceTypeFields<"tag", TagCreateData>;

const initialState: TagsSliceType = {
  tag: { name: "", enabled: true },
  isModalOpen: false,
};

const tagsSlice = createSlice({
  name: "tags",
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
      state.tag.name = action.payload;
    },

    setEnabled(state, action: PayloadAction<boolean>) {
      state.tag.enabled = action.payload;
    },
    setTagState(state, action: PayloadAction<TagCreateData>) {
      return { ...state, tag: action.payload };
    },
    resetTagState(state) {
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
  resetTagState,
  resetState,
  setTagState,
} = tagsSlice.actions;

export default tagsSlice.reducer;
