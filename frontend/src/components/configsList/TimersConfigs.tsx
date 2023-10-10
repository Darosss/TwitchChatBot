import ConfigInput from "./ConfigInput";
import { useConfigsContext } from "./ConfigsContext";
import { ConfigsDispatchActionType, ConfigsWrapperSharedProps } from "./types";

const DISPATCH_TYPE = ConfigsDispatchActionType.SET_TIMERS;

export default function TimersConfigsWrapper({
  showEdit,
}: ConfigsWrapperSharedProps) {
  const {
    configState: [{ timersConfigs }, dispatch],
  } = useConfigsContext();

  return (
    <>
      <ConfigInput
        optionName="Timers interval delay"
        setState={(e) =>
          dispatch({
            type: DISPATCH_TYPE,
            payload: {
              ...timersConfigs,
              timersIntervalDelay: e.target.valueAsNumber,
            },
          })
        }
        value={timersConfigs.timersIntervalDelay}
        showEdit={showEdit}
      />
      <ConfigInput
        optionName="Non follow timers points increment"
        setState={(e) =>
          dispatch({
            type: DISPATCH_TYPE,
            payload: {
              ...timersConfigs,
              nonFollowTimerPoints: e.target.valueAsNumber,
            },
          })
        }
        value={timersConfigs.nonFollowTimerPoints}
        showEdit={showEdit}
      />
      <ConfigInput
        optionName="Non sub timers points increment"
        setState={(e) =>
          dispatch({
            type: DISPATCH_TYPE,
            payload: {
              ...timersConfigs,
              nonSubTimerPoints: e.target.valueAsNumber,
            },
          })
        }
        value={timersConfigs.nonSubTimerPoints}
        showEdit={showEdit}
      />

      <ConfigInput
        optionName="Prefix chances"
        setState={(e) =>
          dispatch({
            type: DISPATCH_TYPE,
            payload: {
              ...timersConfigs,
              prefixChance: e.target.valueAsNumber,
            },
          })
        }
        value={timersConfigs.prefixChance}
        showEdit={showEdit}
      />

      <ConfigInput
        optionName="Sufix chances"
        setState={(e) =>
          dispatch({
            type: DISPATCH_TYPE,
            payload: {
              ...timersConfigs,
              suffixChance: e.target.valueAsNumber,
            },
          })
        }
        value={timersConfigs.suffixChance}
        showEdit={showEdit}
      />
    </>
  );
}
