import React, { useContext, useEffect, useState } from "react";

import { useDeleteBadge, useGetBadges } from "@services";
import { BadgesContextType } from "./types";
import { AxiosError, Loading } from "@components/axiosHelper";
import { useAxiosWithConfirmation } from "@hooks";
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

  const setBadgeIdToDelete = useAxiosWithConfirmation({
    hookToProceed: useDeleteBadge,
    opts: { onFullfiled: () => refetchData() },
  });

  const refetchBadgeData = async (): Promise<void> => {
    await refetchData();
  };

  useEffect(() => {
    if (!badgesData) return;
    setBadgesState(badgesData);
  }, [badgesData]);

  if (error) return <AxiosError error={error} />;
  if (loading || !badgesData) return <Loading />;

  return (
    <BadgesContext.Provider
      value={{
        setBadgeIdToDelete,
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
