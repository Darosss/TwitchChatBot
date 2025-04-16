import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CommonSliceTypeFields } from "./types";
import { Achievement, CustomAchievementCreateData } from "@services";

export enum ManageAchievementsCurrentAction {
  NULL = "null",
  EDIT = "edit achievemnt",
  EDIT_CUSTOM = "edit custom achievement",
  CREATE_CUSTOM = "create custom achievement",
}

export type AchievementSliceDataType = Omit<
  CustomAchievementCreateData,
  "custom"
> &
  Partial<Pick<Achievement, "custom" | "isTime">>;

export type AchievementSliceType = CommonSliceTypeFields<
  "achievement",
  AchievementSliceDataType
> & {
  currentAction: ManageAchievementsCurrentAction;
};

const initialState: AchievementSliceType = {
  currentAction: ManageAchievementsCurrentAction.NULL,
  achievement: {
    name: "",
    description: "",
    tag: "",
    stages: "",
    enabled: true,
    hidden: false,
  },
  isModalOpen: false,
};

const achievementsSlice = createSlice({
  name: "tags",
  initialState,
  reducers: {
    openModal(state) {
      state.isModalOpen = true;
    },
    closeModal(state) {
      state.isModalOpen = false;
    },
    setCurrentAction(
      state,
      action: PayloadAction<ManageAchievementsCurrentAction>
    ) {
      state.currentAction = action.payload;
    },
    setEditingId(state, action: PayloadAction<string>) {
      state.editingId = action.payload;
    },
    setName(state, action: PayloadAction<string>) {
      state.achievement.name = action.payload;
    },
    setDescription(state, action: PayloadAction<string>) {
      state.achievement.description = action.payload;
    },
    setTagId(state, action: PayloadAction<string>) {
      state.achievement.tag = action.payload;
    },
    setStagesId(state, action: PayloadAction<string>) {
      state.achievement.stages = action.payload;
    },
    setHidden(state, action: PayloadAction<boolean>) {
      state.achievement.hidden = action.payload;
    },
    setIsTime(state, action: PayloadAction<boolean>) {
      state.achievement.isTime = action.payload;
    },
    setEnabled(state, action: PayloadAction<boolean>) {
      state.achievement.enabled = action.payload;
    },
    setCustom(state, action: PayloadAction<Achievement["custom"]>) {
      state.achievement.custom = action.payload;
    },

    setAchievementState(
      state,
      action: PayloadAction<AchievementSliceDataType>
    ) {
      return { ...state, achievement: action.payload };
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
  setCurrentAction,
  setEditingId,
  setTagId,
  setStagesId,
  setName,
  setEnabled,
  setHidden,
  setIsTime,
  setCustom,
  setDescription,
  resetTagState,
  resetState,
  setAchievementState,
} = achievementsSlice.actions;

export default achievementsSlice.reducer;
