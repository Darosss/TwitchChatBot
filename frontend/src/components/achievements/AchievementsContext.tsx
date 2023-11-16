import React, { useContext, useEffect, useState } from "react";

import { AchievementsContextType } from "./types";
import { useGetAchievements } from "@services";

const initialAchievementsData: AchievementsContextType["achievementsState"] = {
  count: 0,
  totalPages: 0,
  currentPage: 0,
  data: [],
};

export const AchievementsListContext =
  React.createContext<AchievementsContextType | null>(null);

export const AchievementsListContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const [achievementsState, setAchievementsState] = useState(
    initialAchievementsData
  );

  const {
    data: achievementsData,
    loading,
    error,
    refetchData,
  } = useGetAchievements();

  useEffect(() => {
    if (!achievementsData) return;

    setAchievementsState({ ...achievementsData });
  }, [achievementsData]);

  const refetchAchievements = async (): Promise<void> => {
    await refetchData();
  };

  if (error)
    return (
      <>There is an error. {error.response?.data.message || error.message}</>
    );
  if (loading || !achievementsData) return <> Loading...</>;

  return (
    <AchievementsListContext.Provider
      value={{
        achievementsState,
        refetchAchievements,
      }}
    >
      {children}
    </AchievementsListContext.Provider>
  );
};

export const useAchievementsListContext =
  (): Required<AchievementsContextType> => {
    const achievementsListContext = useContext(AchievementsListContext);

    if (!AchievementsListContext) {
      throw new Error(
        "useAchievementsListContext must be used within a AchievementsListContextProvider"
      );
    }
    return achievementsListContext as AchievementsContextType;
  };
