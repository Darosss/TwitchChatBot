import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CustomRewardCreateData } from "@socketTypes";
import { CommonSliceTypeFields } from "./types";

export type RewardsSliceType = CommonSliceTypeFields<
  "reward",
  CustomRewardCreateData
>;

const initialState: RewardsSliceType = {
  reward: {
    cost: 0,
    title: "",
  },
  isModalOpen: false,
};

const rewardsSlice = createSlice({
  name: "rewards",
  initialState,
  reducers: {
    openModal(state) {
      state.isModalOpen = true;
    },
    closeModal(state) {
      state.isModalOpen = false;
    },
    setEditingAlertSound(state, action: PayloadAction<string>) {
      state.editingId = action.payload;
    },
    setAutoFulfill(state, action: PayloadAction<boolean>) {
      state.reward.autoFulfill = action.payload;
    },
    setBackgroundColor(state, action: PayloadAction<string>) {
      state.reward.backgroundColor = action.payload;
    },
    setCost(state, action: PayloadAction<number>) {
      state.reward.cost = action.payload;
    },
    setGlobalCooldown(state, action: PayloadAction<number | null>) {
      state.reward.globalCooldown = action.payload;
    },
    setIsEnabled(state, action: PayloadAction<boolean>) {
      state.reward.isEnabled = action.payload;
    },
    setMaxRedemptionsPerStream(state, action: PayloadAction<number | null>) {
      state.reward.maxRedemptionsPerStream = action.payload;
    },
    setMaxRedemptionsPerUserPerStream(
      state,
      action: PayloadAction<number | null>
    ) {
      state.reward.maxRedemptionsPerUserPerStream = action.payload;
    },
    setPrompt(state, action: PayloadAction<string>) {
      state.reward.prompt = action.payload;
    },
    setTitle(state, action: PayloadAction<string>) {
      state.reward.title = action.payload;
    },
    setUserInputRequired(state, action: PayloadAction<boolean>) {
      state.reward.userInputRequired = action.payload;
    },

    setRewardState(state, action: PayloadAction<CustomRewardCreateData>) {
      return { ...state, reward: action.payload };
    },
    resetRewardState(state) {
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
  setEditingAlertSound,
  setAutoFulfill,
  setBackgroundColor,
  setCost,
  setGlobalCooldown,
  setIsEnabled,
  setMaxRedemptionsPerStream,
  setMaxRedemptionsPerUserPerStream,
  setPrompt,
  setTitle,
  setUserInputRequired,
  setRewardState,
  resetRewardState,
  resetState,
} = rewardsSlice.actions;

export default rewardsSlice.reducer;
