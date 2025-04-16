import { AchievementCustomField, CustomAchievementAction } from "@services";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootStore } from "@redux/store";
import { setCustom, setIsTime, setName } from "@redux/achievementsSlice";

export default function CustomAchievementModalInputs() {
  const dispatch = useDispatch();
  const { achievement } = useSelector((root: RootStore) => root.achievements);

  const renderDataInputDependsOnAction = useMemo(() => {
    if (!achievement.custom) return;
    const initialCustom: AchievementCustomField = {
      action: CustomAchievementAction.INCLUDES,
    };
    switch (achievement.custom?.action) {
      case CustomAchievementAction.ALL:
        return null;
      case CustomAchievementAction.WATCH_TIME:
        return (
          <>
            <div>Is time (is achievement designed for time check) </div>
            <div>
              <button
                className={`common-button ${
                  achievement.isTime ? "primary-button" : "danger-button"
                }`}
                onClick={() => dispatch(setIsTime(!achievement.isTime))}
              >
                {String(achievement.isTime)}
              </button>
            </div>
          </>
        );
      case CustomAchievementAction.INCLUDES:
      case CustomAchievementAction.STARTS_WITH:
      case CustomAchievementAction.ENDS_WITH:
        return (
          <>
            <div>Set custom values </div>
            <div>
              <textarea
                onChange={(e) =>
                  dispatch(
                    setCustom({
                      ...(achievement.custom || initialCustom),
                      stringValues: e.target.value.split("\n"),
                    })
                  )
                }
                value={achievement.custom.stringValues?.join("\n")}
              />
            </div>
            <div> Case sensitive </div>
            <div>
              <button
                className={`common-button ${
                  achievement.custom.caseSensitive
                    ? "primary-button"
                    : "danger-button"
                }`}
                onClick={() =>
                  dispatch(
                    setCustom({
                      ...(achievement.custom || initialCustom),
                      caseSensitive: !achievement.custom?.caseSensitive,
                    })
                  )
                }
              >
                {String(achievement.custom.caseSensitive) || "False"}
              </button>
            </div>
          </>
        );
      case CustomAchievementAction.MESSAGE_GT:
      case CustomAchievementAction.MESSAGE_LT:
        return (
          <>
            <div>Set number value</div>
            <div>
              <input
                type="number"
                min={1}
                onChange={(e) => {
                  const value = e.target.valueAsNumber;
                  dispatch(
                    setCustom({
                      ...(achievement.custom || initialCustom),
                      numberValue: value > 0 ? value : 5,
                    })
                  );
                }}
                value={achievement.custom.numberValue || 5}
              />
            </div>
          </>
        );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [achievement]);

  return (
    <>
      <div className="modal-custom-achievement-name">Name </div>
      <div className="modal-custom-achievement-name">
        <input
          type="text"
          onChange={(e) => dispatch(setName(e.target.value))}
          value={achievement.name}
        />
      </div>
      <div>Set custom action </div>
      <div>
        Action:
        <select
          value={achievement.custom?.action}
          onChange={(e) =>
            dispatch(
              setCustom({
                ...achievement.custom,
                action: e.target.value as CustomAchievementAction,
              })
            )
          }
        >
          {Object.values(CustomAchievementAction).map((value, index) => (
            <option key={index}>{value}</option>
          ))}
        </select>
      </div>

      {renderDataInputDependsOnAction}
    </>
  );
}
