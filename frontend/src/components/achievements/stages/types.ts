import { AchievementStage, PaginationData } from "@services";

export interface ManyAchievementStageContextType {
  achievementStagesState: PaginationData<AchievementStage>;
  refetchStages: () => Promise<void>;
}
