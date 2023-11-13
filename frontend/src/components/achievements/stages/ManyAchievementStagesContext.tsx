import React, { useContext, useEffect, useState } from "react";

import { useGetAchievementStages } from "@services";
import { ManyAchievementStageContextType } from "./types";

const initialAchievementStagesData: ManyAchievementStageContextType["achievementStagesState"] =
  { count: 0, totalPages: 0, currentPage: 0, data: [] };

export const ManyAchievementStagesContext =
  React.createContext<ManyAchievementStageContextType | null>(null);

export const ManyAchievementStagesContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const [achievementStagesState, setAchievementStagesState] = useState(
    initialAchievementStagesData
  );

  const {
    data: stagesData,
    loading,
    error,
    refetchData,
  } = useGetAchievementStages();

  useEffect(() => {
    if (!stagesData) return;

    setAchievementStagesState({ ...stagesData });
  }, [stagesData]);

  const refetchStages = async (): Promise<void> => {
    await refetchData();
  };

  if (error)
    return (
      <>There is an error. {error.response?.data.message || error.message}</>
    );
  if (loading || !stagesData) return <> Loading...</>;

  return (
    <ManyAchievementStagesContext.Provider
      value={{
        achievementStagesState,
        refetchStages,
      }}
    >
      {children}
    </ManyAchievementStagesContext.Provider>
  );
};

export const useManyAchievementStagesContext =
  (): Required<ManyAchievementStageContextType> => {
    const manyAchievementStagesContext = useContext(
      ManyAchievementStagesContext
    );

    if (!manyAchievementStagesContext) {
      throw new Error(
        "useManyAchievementStagesContext must be used within a ManyAchievementStagesContextProvider"
      );
    }
    return manyAchievementStagesContext as ManyAchievementStageContextType;
  };
