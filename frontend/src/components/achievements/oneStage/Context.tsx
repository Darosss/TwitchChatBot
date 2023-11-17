import React, { useContext, useEffect, useReducer, useState } from "react";

import {
  AchievementStage,
  AchievementStageData,
  useGetAchievementStageById,
} from "@services";
import {
  AchievementStageContextType,
  AchievementStageDispatchAction,
  UpdateStageDataByIndexFn,
} from "./types";
import { useParams } from "react-router-dom";

type AchievementStageContextStateType =
  AchievementStageContextType["achievementStageState"][0];
const initialAchievementStageData: AchievementStageContextStateType = {
  _id: "",
  createdAt: new Date(),
  updatedAt: new Date(),
  name: "",
  stageData: [],
};

export const AchievementStageContext =
  React.createContext<AchievementStageContextType | null>(null);

export const AchievementStageContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const { id } = useParams();

  const [achievementStageState, dispatchAchievementStageState] = useReducer(
    reducer,
    initialAchievementStageData
  );
  const {
    data: achievementStageData,
    error,
    loading,
    refetchData,
  } = useGetAchievementStageById(id || "");

  const refetchAchievementStageData = async (): Promise<void> => {
    await refetchData();
  };

  const [isGoalTime, setIsGoalTime] = useState(false);

  useEffect(() => {
    if (!achievementStageData) return;
    dispatchAchievementStageState({
      type: "SET_STATE",
      payload: achievementStageData.data,
    });
  }, [achievementStageData]);

  if (error)
    return (
      <>There is an error. {error.response?.data.message || error.message}</>
    );
  if (loading || !achievementStageData) return <> Loading...</>;

  const updateStageDataByIndex: UpdateStageDataByIndexFn = (
    index: number,
    updateData: AchievementStageData
  ) => {
    const newStageData = achievementStageState.stageData;
    newStageData[index] = updateData;
    dispatchAchievementStageState({
      type: "SET_STAGE_DATA",
      payload: newStageData,
    });
  };

  return (
    <AchievementStageContext.Provider
      value={{
        achievementStageState: [
          achievementStageState,
          dispatchAchievementStageState,
        ],
        refetchAchievementStageData,
        updateStageDataByIndex,
        isGoalTimeState: [isGoalTime, setIsGoalTime],
      }}
    >
      {children}
    </AchievementStageContext.Provider>
  );
};

export const useAchievementStageContext =
  (): Required<AchievementStageContextType> => {
    const achievementStageContext = useContext(AchievementStageContext);

    if (!achievementStageContext) {
      throw new Error(
        "useAchievementStageContext must be used within a AchievementStageContextProvider"
      );
    }
    return achievementStageContext as AchievementStageContextType;
  };

function reducer(
  state: AchievementStage,
  action: AchievementStageDispatchAction
): AchievementStage {
  switch (action.type) {
    case "SET_NAME":
      return { ...state, name: action.payload };
    case "SET_STAGE_DATA":
      return { ...state, stageData: action.payload };
    case "PUSH_TO_STAGE_DATA":
      return { ...state, stageData: [...state.stageData, action.payload] };
    case "SET_STATE":
      return { ...action.payload };
    default:
      throw new Error("Invalid action type");
  }
}
