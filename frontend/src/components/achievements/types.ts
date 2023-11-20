import {
  Achievement,
  AchievementCustomField,
  AchievementStage,
  PaginationData,
  Tag,
} from "@services";

export interface AchievementsContextType {
  achievementsState: PaginationData<Achievement>;
  refetchAchievements: () => Promise<void>;
}

export interface AchievementStateType
  extends Omit<Achievement, "createdAt" | "updatedAt" | "tag" | "stages"> {
  tag: Pick<Tag, "_id" | "name">;
  stages: Pick<AchievementStage, "_id" | "name">;
}

export enum ManageAchievementsCurrentAction {
  NULL = "null",
  EDIT = "edit achievemnt",
  EDIT_CUSTOM = "edit custom achievement",
  CREATE_CUSTOM = "create custom achievement",
}

export interface ManageAchievementContextType {
  achievementState: [
    AchievementStateType,
    React.Dispatch<ManageAchievementDispatchAction>
  ];
  showModalState: [boolean, (value: boolean) => void];
  setCurrentAction: (value: ManageAchievementsCurrentAction) => void;
}
export type ManageAchievementDispatchAction =
  | { type: "SET_NAME"; payload: string }
  | { type: "SET_DESCRIPTION"; payload: string }
  | { type: "SET_STAGES"; payload: AchievementStateType["stages"] }
  | { type: "SET_TAG"; payload: AchievementStateType["tag"] }
  | { type: "SET_ENABLED"; payload: boolean }
  | { type: "SET_HIDDEN"; payload: boolean }
  | { type: "SET_IS_TIME"; payload: boolean }
  | { type: "SET_CUSTOM"; payload: AchievementCustomField }
  | { type: "SET_STATE"; payload: AchievementStateType };
