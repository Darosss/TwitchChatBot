import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  AchievementStage,
  AchievementStageData,
  Badge,
  StageDataRarity,
} from "@services";
import { CommonSliceTypeFields } from "./types";

export type StagesSliceType = CommonSliceTypeFields<
  "stage",
  Omit<AchievementStage, "createdAt" | "updatedAt" | "_id"> & {
    createdAt: string;
    updatedAt: string;
  }
> & { isGoalTime: boolean };

const initialState: StagesSliceType = {
  isGoalTime: false,
  stage: {
    name: "",
    stageData: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  isModalOpen: false,
};

type UpdateStageDataByIndexPayload = {
  index: number;
  updateData: AchievementStageData;
};

type StageDataUpdatePayload = {
  index: number;
} & (
  | { keyName: "badge"; value: Badge }
  | { keyName: "stage" | "goal" | "showTimeMs"; value: number }
  | { keyName: "name" | "sound"; value: string }
  | { keyName: "rarity"; value: StageDataRarity }
);
type UpdateStageDataBadgeByIndexPayload = {
  index: number;
  badge: Badge;
};

const stageSlice = createSlice({
  name: "stages",
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
    setIsGoalTime(state, action: PayloadAction<boolean>) {
      state.isGoalTime = action.payload;
    },
    setName(state, action: PayloadAction<string>) {
      state.stage.name = action.payload;
    },
    setStageData(
      state,
      action: PayloadAction<StagesSliceType["stage"]["stageData"]>
    ) {
      state.stage.stageData = action.payload;
    },
    setStageState(state, action: PayloadAction<StagesSliceType["stage"]>) {
      return { ...state, stage: action.payload };
    },
    pushToStageData(state, action: PayloadAction<AchievementStageData>) {
      state.stage.stageData.push(action.payload);
    },
    updateStageDataByIndex(
      state,
      action: PayloadAction<UpdateStageDataByIndexPayload>
    ) {
      const newStageData = state.stage.stageData;

      newStageData[action.payload.index] = action.payload.updateData;

      state.stage.stageData = newStageData;
    },
    updateStageDataPropertyByIndex(
      state,
      action: PayloadAction<StageDataUpdatePayload>
    ) {
      const { index, keyName, value } = action.payload;

      const updated = { ...state.stage.stageData[index], [keyName]: value };

      state.stage.stageData[index] = updated;
    },

    updateStageStageDataBadgeByIndex(
      state,
      action: PayloadAction<UpdateStageDataBadgeByIndexPayload>
    ) {
      const newStageData = state.stage.stageData;

      newStageData[action.payload.index] = {
        ...newStageData[action.payload.index],
        badge: action.payload.badge,
      };

      state.stage.stageData = newStageData;
    },
    removeStageDataByIndex(state, action: PayloadAction<number>) {
      const index = action.payload;
      if (index === state.stage.stageData.length) return;

      state.stage.stageData.splice(index, 1);

      const newStageData = state.stage.stageData.map((data, stageDataIndex) => {
        if (stageDataIndex >= index) return { ...data, stage: data.stage - 1 };

        return data;
      });

      state.stage.stageData = newStageData;
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
  setIsGoalTime,
  setEditingId,
  setName,
  setStageData,
  setStageState,
  updateStageDataByIndex,
  updateStageStageDataBadgeByIndex,
  updateStageDataPropertyByIndex,
  removeStageDataByIndex,
  pushToStageData,
  resetAffixState,
  resetState,
} = stageSlice.actions;

export default stageSlice.reducer;
