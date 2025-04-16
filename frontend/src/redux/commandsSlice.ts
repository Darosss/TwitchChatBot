import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChatCommandCreateData } from "@services";

import { CommonSliceTypeFields } from "./types";

export type ChatCommandsSliceType = CommonSliceTypeFields<
  "command",
  ChatCommandCreateData
>;

const initialState: ChatCommandsSliceType = {
  command: {
    name: "",
    enabled: true,
    tag: "",
    mood: "",
    description: "",
    aliases: [],
    messages: [],
    privilege: 0,
  },
  isModalOpen: false,
};

const commandsSlice = createSlice({
  name: "commands",
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
      state.command.name = action.payload;
    },
    setEnabled(state, action: PayloadAction<boolean>) {
      state.command.enabled = action.payload;
    },
    setTag(state, action: PayloadAction<string>) {
      state.command.tag = action.payload;
    },
    setMood(state, action: PayloadAction<string>) {
      state.command.mood = action.payload;
    },
    setAliases(state, action: PayloadAction<string[]>) {
      state.command.aliases = action.payload;
    },
    setPrivilege(state, action: PayloadAction<number>) {
      state.command.privilege = action.payload;
    },
    setMessages(state, action: PayloadAction<string[]>) {
      state.command.messages = action.payload;
    },
    setDescription(state, action: PayloadAction<string>) {
      state.command.description = action.payload;
    },
    setCommandState(state, action: PayloadAction<ChatCommandCreateData>) {
      return { ...state, command: action.payload };
    },
    resetCommandState(state) {
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
  setAliases,
  setMessages,
  setMood,
  setTag,
  setPrivilege,
  setDescription,
  resetCommandState,
  resetState,
  setCommandState,
} = commandsSlice.actions;

export default commandsSlice.reducer;
