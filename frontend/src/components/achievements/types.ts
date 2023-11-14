import { Achievement, PaginationData } from "@services";

export interface AchievementsContextType {
  achievementsState: PaginationData<Achievement>;
  refetchAchievements: () => Promise<void>;
}
