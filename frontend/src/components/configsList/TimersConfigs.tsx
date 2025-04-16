import { setTimersConfigs } from "@redux/configsSlice";
import { RootStore } from "@redux/store";
import ConfigInput from "./ConfigInput";
import { useDispatch, useSelector } from "react-redux";

export default function TimersConfigsWrapper() {
  const dispatch = useDispatch();
  const {
    isUpdateMode,
    config: { timersConfigs },
  } = useSelector((state: RootStore) => state.configs);

  return (
    <>
      <ConfigInput
        optionName="Timers interval delay"
        setState={(e) =>
          dispatch(
            setTimersConfigs([
              "timersIntervalDelay",
              e.currentTarget.valueAsNumber,
            ])
          )
        }
        value={timersConfigs.timersIntervalDelay}
        showEdit={isUpdateMode}
      />
      <ConfigInput
        optionName="Non follow timers points increment"
        setState={(e) =>
          dispatch(
            setTimersConfigs([
              "nonFollowTimerPoints",
              e.currentTarget.valueAsNumber,
            ])
          )
        }
        value={timersConfigs.nonFollowTimerPoints}
        showEdit={isUpdateMode}
      />
      <ConfigInput
        optionName="Non sub timers points increment"
        setState={(e) =>
          dispatch(
            setTimersConfigs([
              "nonSubTimerPoints",
              e.currentTarget.valueAsNumber,
            ])
          )
        }
        value={timersConfigs.nonSubTimerPoints}
        showEdit={isUpdateMode}
      />

      <ConfigInput
        optionName="Prefix chances"
        setState={(e) =>
          dispatch(
            setTimersConfigs(["prefixChance", e.currentTarget.valueAsNumber])
          )
        }
        value={timersConfigs.prefixChance}
        showEdit={isUpdateMode}
      />

      <ConfigInput
        optionName="Sufix chances"
        setState={(e) =>
          dispatch(
            setTimersConfigs(["suffixChance", e.currentTarget.valueAsNumber])
          )
        }
        value={timersConfigs.suffixChance}
        showEdit={isUpdateMode}
      />
    </>
  );
}
