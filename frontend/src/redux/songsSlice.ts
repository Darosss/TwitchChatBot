import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SongCreateData } from "@services";
import { CommonSliceTypeFields } from "./types";

export type SongsSliceType = CommonSliceTypeFields<"song", SongCreateData>;

const initialState: SongsSliceType = {
  song: {
    title: "",
    youtubeId: "",
    customTitle: { title: "", band: "" },
    duration: 0,
    customId: "",
    whoAdded: "",
    enabled: true,
    tags: "",
  },
  isModalOpen: false,
};

const songsSlice = createSlice({
  name: "songs",
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
    setTitle(state, action: PayloadAction<string>) {
      state.song.title = action.payload;
    },
    setYoutubeId(state, action: PayloadAction<string>) {
      state.song.youtubeId = action.payload;
    },
    setSunoId(state, action: PayloadAction<string>) {
      state.song.sunoId = action.payload;
    },
    setCustomTitle(
      state,
      action: PayloadAction<{ title: string; band: string }>
    ) {
      state.song.customTitle = action.payload;
    },
    setDuration(state, action: PayloadAction<number>) {
      state.song.duration = action.payload;
    },
    setCustomId(state, action: PayloadAction<string>) {
      state.song.customId = action.payload;
    },
    setWhoAdded(state, action: PayloadAction<string>) {
      state.song.whoAdded = action.payload;
    },
    setEnabled(state, action: PayloadAction<boolean>) {
      state.song.enabled = action.payload;
    },
    setSongState(state, action: PayloadAction<SongCreateData>) {
      return { ...state, song: action.payload };
    },
    resetSongState(state) {
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
  setTitle,
  setYoutubeId,
  setSunoId,
  setCustomTitle,
  setDuration,
  setCustomId,
  setWhoAdded,
  setEnabled,
  setSongState,
  resetSongState,
} = songsSlice.actions;

export default songsSlice.reducer;
