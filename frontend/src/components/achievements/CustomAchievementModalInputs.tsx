import { AchievementCustomField, CustomAchievementAction } from "@services";
import { useMemo } from "react";
import { useManageAchievementContext } from "./ManageAchievementContext";

export default function CustomAchievementModalInputs() {
  const {
    achievementState: [state, dispatch],
  } = useManageAchievementContext();

  const renderDataInputDependsOnAction = useMemo(() => {
    if (!state.custom) return;
    const initialCustom: AchievementCustomField = {
      action: CustomAchievementAction.INCLUDES,
    };
    switch (state.custom?.action) {
      case CustomAchievementAction.ALL:
        return null;
      case CustomAchievementAction.WATCH_TIME:
        return (
          <>
            <div>Is time (is achievement designed for time check) </div>
            <div>
              <button
                className={`common-button ${
                  state.isTime ? "primary-button" : "danger-button"
                }`}
                onClick={() => dispatch({ type: "SET_IS_TIME", payload: true })}
              >
                {String(state.isTime)}
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
                  dispatch({
                    type: "SET_CUSTOM",
                    payload: {
                      ...(state.custom || initialCustom),
                      stringValues: e.target.value.split("\n"),
                    },
                  })
                }
                value={state.custom.stringValues?.join("\n")}
              />
            </div>
            <div> Case sensitive </div>
            <div>
              <button
                className={`common-button ${
                  state.custom.caseSensitive
                    ? "primary-button"
                    : "danger-button"
                }`}
                onClick={() =>
                  dispatch({
                    type: "SET_CUSTOM",
                    payload: {
                      ...(state.custom || initialCustom),
                      caseSensitive: !state.custom?.caseSensitive,
                    },
                  })
                }
              >
                {String(state.custom.caseSensitive) || "False"}
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

                  dispatch({
                    type: "SET_CUSTOM",
                    payload: {
                      ...(state.custom || initialCustom),
                      numberValue: value > 0 ? value : 5,
                    },
                  });
                }}
                value={state.custom.numberValue || 5}
              />
            </div>
          </>
        );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <>
      <div className="modal-custom-achievement-name">Name </div>
      <div className="modal-custom-achievement-name">
        <input
          type="text"
          onChange={(e) =>
            dispatch({ type: "SET_NAME", payload: e.target.value })
          }
          value={state.name}
        />
      </div>
      <div>Set custom action </div>
      <div>
        Action:
        <select
          value={state.custom?.action}
          onChange={(e) =>
            dispatch({
              type: "SET_CUSTOM",
              payload: {
                ...state.custom,
                action: e.target.value as CustomAchievementAction,
              },
            })
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
