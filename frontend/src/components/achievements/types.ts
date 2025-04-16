import { Achievement, AchievementStage, PaginationData, Tag } from "@services";

export interface AchievementsContextType {
  achievementsState: PaginationData<Achievement>;
  refetchAchievements: () => Promise<void>;
}

export interface AchievementStateType
  extends Omit<Achievement, "createdAt" | "updatedAt" | "tag" | "stages"> {
  tag: Pick<Tag, "_id" | "name">;
  stages: Pick<AchievementStage, "_id" | "name">;
}
