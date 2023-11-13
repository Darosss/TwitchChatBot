import React, { useContext, useEffect, useState } from "react";

import { useGetBadges } from "@services";
import { BadgesContextType } from "./types";
const initialBadgeState: BadgesContextType["badgesState"] = {
  count: 0,
  totalPages: 0,
  currentPage: 0,
  data: [],
};

export const BadgesContext = React.createContext<BadgesContextType | null>(
  null
);

export const BadgesContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const [badgesState, setBadgesState] =
    useState<BadgesContextType["badgesState"]>(initialBadgeState);
  const { data: badgesData, error, loading, refetchData } = useGetBadges();

  const refetchBadgeData = async (): Promise<void> => {
    await refetchData();
  };

  useEffect(() => {
    if (!badgesData) return;
    setBadgesState(badgesData);
  }, [badgesData]);

  if (error)
    return (
      <>There is an error. {error.response?.data.message || error.message}</>
    );
  if (loading || !badgesData) return <> Loading...</>;

  return (
    <BadgesContext.Provider
      value={{
        badgesState,
        refetchBadgeData,
      }}
    >
      {children}
    </BadgesContext.Provider>
  );
};

export const useBadgesContext = (): Required<BadgesContextType> => {
  const achievementStageContext = useContext(BadgesContext);

  if (!achievementStageContext) {
    throw new Error(
      "useBadgesContext must be used within a BadgesContextProvider"
    );
  }
  return achievementStageContext as BadgesContextType;
};

// function reducer(
//   state: BadgeCreateData,
//   action: BadgeDispatchAction
// ): BadgeCreateData {
//   switch (action.type) {
//     case "SET_NAME":
//       return { ...state, state: { name: action.payload } };
//     case "SET_IMAGE_URL":
//       return { ...state, imageUrl: action.payload };
//     case "SET_DESCRIPTION":
//       return { ...state, description: action.payload };
//     case "SET_STATE":
//       return { ...action.payload };
//     default:
//       throw new Error("Invalid action type");
//   }
// }
