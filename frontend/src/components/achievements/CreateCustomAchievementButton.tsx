import { CustomAchievementAction } from "@services";
import {
  initialAchievementData,
  useManageAchievementContext,
} from "./ManageAchievementContext";
import { AchievementStateType, ManageAchievementsCurrentAction } from "./types";

const initialAchievementCustomData: AchievementStateType &
  Required<Pick<AchievementStateType, "custom">> = {
  ...initialAchievementData,
  custom: { action: CustomAchievementAction.ALL },
};

export function CreateCustomAchievementButton() {
  const {
    achievementState: [, dispatch],
    showModalState: [, setShowModal],
    setCurrentAction,
  } = useManageAchievementContext();

  return (
    <div>
      <button
        className="common-button primary-button"
        onClick={() => {
          setShowModal(true);
          setCurrentAction(ManageAchievementsCurrentAction.CREATE_CUSTOM);
          dispatch({
            type: "SET_STATE",
            payload: initialAchievementCustomData,
          });
        }}
      >
        Create custom
      </button>
    </div>
  );
}
