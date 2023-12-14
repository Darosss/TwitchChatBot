import React, {
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useState,
} from "react";

import {
  AchievementStateType,
  ManageAchievementContextType,
  ManageAchievementDispatchAction,
  ManageAchievementsCurrentAction,
} from "./types";
import EditCreateAchievementModal from "./EditCreateAchievementModal";
import {
  CustomAchievementAction,
  useCreateCustomAchievement,
  useEditAchievement,
  useUpdateCustomAchievement,
} from "@services";
import { addSuccessNotification } from "@utils";

type AchievementContextStateType =
  ManageAchievementContextType["achievementState"][0];
export const initialAchievementData: AchievementContextStateType = {
  _id: "",
  name: "",
  description: "",
  isTime: false,
  enabled: true,
  stages: { _id: "", name: "" },
  tag: { _id: "", name: "" },
};

const initialAchievementCustomData: Required<
  Pick<AchievementStateType, "custom">
> = {
  custom: { action: CustomAchievementAction.ALL },
};

export const ManageAchievementContext =
  React.createContext<ManageAchievementContextType | null>(null);

export const ManageAchievementContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const [achievementState, dispatchAchievementState] = useReducer(
    reducer,
    initialAchievementData
  );
  const [showModal, setShowModal] = useState(false);
  const [currentAction, setCurrentAction] =
    useState<ManageAchievementsCurrentAction>(
      ManageAchievementsCurrentAction.NULL
    );
  const modifiedStateToCustomAchievement = useMemo(
    () => ({
      name: achievementState.name,
      stages: achievementState.stages._id,
      tag: achievementState.tag._id,
      description: achievementState.description,
      isTime: achievementState.isTime,
      enabled: achievementState.enabled,
      custom: achievementState.custom || initialAchievementCustomData.custom,
      hidden: achievementState.hidden,
    }),
    [achievementState]
  );
  const { refetchData: fetchCreateCustomAchievement } =
    useCreateCustomAchievement(modifiedStateToCustomAchievement);

  const { refetchData: fetchUpdateCustomAchievement } =
    useUpdateCustomAchievement(
      achievementState._id,
      modifiedStateToCustomAchievement
    );
  const { refetchData: fetchUpdateAchievement } = useEditAchievement(
    achievementState._id,
    {
      enabled: achievementState.enabled,
      description: achievementState.description,
      stages: achievementState.stages._id,
      tag: achievementState.tag._id,
      hidden: achievementState.hidden,
    }
  );

  const currentActionSubmit = useCallback(() => {
    if (!currentAction) return null;
    switch (currentAction) {
      case ManageAchievementsCurrentAction.EDIT:
        return fetchUpdateAchievement();
      case ManageAchievementsCurrentAction.EDIT_CUSTOM:
        return fetchUpdateCustomAchievement();
      case ManageAchievementsCurrentAction.CREATE_CUSTOM:
        return fetchCreateCustomAchievement();
    }
  }, [
    currentAction,
    fetchCreateCustomAchievement,
    fetchUpdateAchievement,
    fetchUpdateCustomAchievement,
  ]);

  return (
    <ManageAchievementContext.Provider
      value={{
        achievementState: [achievementState, dispatchAchievementState],
        showModalState: [showModal, setShowModal],
        setCurrentAction,
      }}
    >
      {children}
      {/* TODO: check whether thats correct to use context in EditCreateAchievementModal or should pass it as props */}
      <EditCreateAchievementModal
        onSubmit={async () => {
          currentActionSubmit()?.then(() =>
            addSuccessNotification(`Successfuly ${currentAction}`)
          );
        }}
      />
    </ManageAchievementContext.Provider>
  );
};

export const useManageAchievementContext =
  (): Required<ManageAchievementContextType> => {
    const manageAchievementContext = useContext(ManageAchievementContext);
    if (!ManageAchievementContext) {
      throw new Error(
        "useManageAchievementContext must be used within a ManageAchievementContextProvider"
      );
    }
    return manageAchievementContext as ManageAchievementContextType;
  };

function reducer(
  state: AchievementContextStateType,
  action: ManageAchievementDispatchAction
): AchievementContextStateType {
  switch (action.type) {
    case "SET_NAME":
      return { ...state, name: action.payload };
    case "SET_DESCRIPTION":
      return { ...state, description: action.payload };
    case "SET_STAGES":
      return { ...state, stages: action.payload };
    case "SET_TAG":
      return { ...state, tag: action.payload };
    case "SET_ENABLED":
      return { ...state, enabled: action.payload };
    case "SET_HIDDEN":
      return { ...state, hidden: action.payload };
    case "SET_IS_TIME":
      return { ...state, isTime: action.payload };
    case "SET_CUSTOM":
      return { ...state, custom: action.payload };
    case "SET_STATE":
      return { ...action.payload };
    default:
      throw new Error("Invalid action type");
  }
}
