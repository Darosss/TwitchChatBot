import { CustomAchievementAction } from "@services";
import { useDispatch } from "react-redux";
import {
  AchievementSliceDataType,
  ManageAchievementsCurrentAction,
  openModal,
  setAchievementState,
  setCurrentAction,
} from "@redux/achievementsSlice";

const initialAchievementData: Required<AchievementSliceDataType> = {
  name: "",
  description: "",
  isTime: false,
  enabled: true,
  stages: "",
  tag: "",
  custom: { action: CustomAchievementAction.ALL },
  hidden: false,
};

export function CreateCustomAchievementButton() {
  const dispatch = useDispatch();
  return (
    <div>
      <button
        className="common-button primary-button"
        onClick={() => {
          dispatch(openModal());

          dispatch(
            setCurrentAction(ManageAchievementsCurrentAction.CREATE_CUSTOM)
          );
          dispatch(setAchievementState(initialAchievementData));
        }}
      >
        Create custom
      </button>
    </div>
  );
}
