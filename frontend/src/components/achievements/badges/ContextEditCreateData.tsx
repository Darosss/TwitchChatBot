import React, { useContext, useReducer, useState } from "react";

import {
  BadgeDispatchAction,
  BadgeContextEditCreateDataType,
  BadgeStateType,
} from "./types";

type BadgeContextStateType = BadgeContextEditCreateDataType["badgeState"][0];

const initialBadgeState: BadgeContextStateType = {
  _id: "",
  name: "",
  description: "",
  imagesUrls: { x32: "", x64: "", x96: "", x128: "" },
};

export const BadgeContextEditCreateData =
  React.createContext<BadgeContextEditCreateDataType | null>(null);

export const BadgeContextEditCreateDataProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const [badgeState, dispatch] = useReducer(reducer, initialBadgeState);
  const [showModal, setShowModal] = useState(false);

  const setShowModalState = (value: boolean) => {
    setShowModal(value);
  };

  return (
    <BadgeContextEditCreateData.Provider
      value={{
        badgeState: [badgeState, dispatch],
        showModalState: [showModal, setShowModalState],
      }}
    >
      {children}
    </BadgeContextEditCreateData.Provider>
  );
};

export const useBadgeContextEditCreateData =
  (): Required<BadgeContextEditCreateDataType> => {
    const achievementStageContext = useContext(BadgeContextEditCreateData);

    if (!achievementStageContext) {
      throw new Error(
        "useBadgeContextEditCreateData must be used within a BadgesContextProvider"
      );
    }
    return achievementStageContext as BadgeContextEditCreateDataType;
  };

function reducer(
  state: BadgeStateType,
  action: BadgeDispatchAction
): BadgeStateType {
  switch (action.type) {
    case "SET_NAME":
      return { ...state, name: action.payload };
    case "SET_IMAGES_URLS":
      return { ...state, imagesUrls: action.payload };
    case "SET_DESCRIPTION":
      return { ...state, description: action.payload };
    case "SET_STATE":
      return { ...action.payload };
    default:
      throw new Error("Invalid action type");
  }
}
