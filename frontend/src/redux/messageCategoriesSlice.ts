import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MessageCategoryCreateData } from "@services";
import { CommonSliceTypeFields } from "./types";

export type MessageCategoriesSliceType = CommonSliceTypeFields<
  "messageCategory",
  MessageCategoryCreateData
>;

const initialState: MessageCategoriesSliceType = {
  messageCategory: {
    name: "",
    enabled: true,
    messages: [],
    tag: "",
    mood: "",
  },
  isModalOpen: false,
};

const messageCategorySlice = createSlice({
  name: "messageCategories",
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
      state.messageCategory.name = action.payload;
    },
    setTag(state, action: PayloadAction<string>) {
      state.messageCategory.tag = action.payload;
    },
    setMood(state, action: PayloadAction<string>) {
      state.messageCategory.mood = action.payload;
    },
    setMessages(state, action: PayloadAction<string[]>) {
      state.messageCategory.messages = action.payload;
    },
    setEnabled(state, action: PayloadAction<boolean>) {
      state.messageCategory.enabled = action.payload;
    },
    toggleEnabled(state) {
      state.messageCategory.enabled = !state.messageCategory.enabled;
    },
    setMessageCategoryState(
      state,
      action: PayloadAction<MessageCategoryCreateData>
    ) {
      return {
        ...state,
        messageCategory: action.payload,
      };
    },
    resetMessageCategoryState(state) {
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
  toggleEnabled,
  setMessages,
  setMood,
  setTag,
  resetMessageCategoryState,
  resetState,
  setMessageCategoryState,
} = messageCategorySlice.actions;

export default messageCategorySlice.reducer;
