import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AffixCreateData } from "@services";
import { CommonSliceTypeFields } from "./types";

export type AffixesSliceType = CommonSliceTypeFields<"affix", AffixCreateData>;

const initialState: AffixesSliceType = {
  affix: {
    name: "",
    prefixChance: 0,
    suffixChance: 0,
    prefixes: [],
    suffixes: [],
    enabled: true,
  },
  isModalOpen: false,
};

const affixSlice = createSlice({
  name: "affixes",
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
      state.affix.name = action.payload;
    },
    setPrefixChance(state, action: PayloadAction<number>) {
      state.affix.prefixChance = action.payload;
    },
    setSuffixChance(state, action: PayloadAction<number>) {
      state.affix.suffixChance = action.payload;
    },
    setEnabled(state, action: PayloadAction<boolean>) {
      state.affix.enabled = action.payload;
    },
    setSuffixes(state, action: PayloadAction<string[]>) {
      state.affix.suffixes = action.payload;
    },
    setPrefixes(state, action: PayloadAction<string[]>) {
      state.affix.prefixes = action.payload;
    },
    setAffixState(state, action: PayloadAction<AffixCreateData>) {
      return { ...state, affix: action.payload };
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
  setPrefixChance,
  setSuffixChance,
  setEnabled,
  setSuffixes,
  setPrefixes,
  resetAffixState,
  resetState,
  setAffixState,
} = affixSlice.actions;

export default affixSlice.reducer;
