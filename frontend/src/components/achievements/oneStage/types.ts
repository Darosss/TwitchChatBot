import { AchievementStage, AchievementStageData } from "@services";
export type UpdateStageDataByIndexFn = (
  index: number,
  updateData: AchievementStageData
) => void;

export interface AchievementStageContextType {
  achievementStageState: [
    AchievementStage,
    React.Dispatch<AchievementStageDispatchAction>
  ];
  refetchAchievementStageData: () => Promise<void>;
  updateStageDataByIndex: UpdateStageDataByIndexFn;
}

export type AchievementStageDispatchAction =
  | { type: "SET_NAME"; payload: string }
  | { type: "SET_STAGE_DATA"; payload: AchievementStageData[] }
  | { type: "PUSH_TO_STAGE_DATA"; payload: AchievementStageData }
  | { type: "SET_STATE"; payload: AchievementStage };
