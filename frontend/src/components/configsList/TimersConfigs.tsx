import { TimersConfigs } from "@services/ConfigService";
import ConfigInput from "./ConfigInput";
export default function TimersConfigsWrapper(props: {
  timersState: [
    TimersConfigs,
    React.Dispatch<React.SetStateAction<TimersConfigs>>
  ];
  showEdit: boolean;
}) {
  const { timersState, showEdit } = props;
  const [timersConfigs, setTimersConfigs] = timersState;
  return (
    <>
      <ConfigInput
        optionName="Timers interval delay"
        setState={(e) =>
          setTimersConfigs((prevState) => ({
            ...prevState,
            timersIntervalDelay: e.target.valueAsNumber,
          }))
        }
        value={timersConfigs.timersIntervalDelay}
        showEdit={showEdit}
      />
      <ConfigInput
        optionName="Non follow timers points increment"
        setState={(e) =>
          setTimersConfigs((prevState) => ({
            ...prevState,
            nonFollowTimerPoints: e.target.valueAsNumber,
          }))
        }
        value={timersConfigs.nonFollowTimerPoints}
        showEdit={showEdit}
      />
      <ConfigInput
        optionName="Non sub timers points increment"
        setState={(e) =>
          setTimersConfigs((prevState) => ({
            ...prevState,
            nonSubTimerPoints: e.target.valueAsNumber,
          }))
        }
        value={timersConfigs.nonSubTimerPoints}
        showEdit={showEdit}
      />

      <ConfigInput
        optionName="Prefix chances"
        setState={(e) =>
          setTimersConfigs((prevState) => ({
            ...prevState,
            prefixChance: e.target.valueAsNumber,
          }))
        }
        value={timersConfigs.prefixChance}
        showEdit={showEdit}
      />

      <ConfigInput
        optionName="Sufix chances"
        setState={(e) =>
          setTimersConfigs((prevState) => ({
            ...prevState,
            sufixChance: e.target.valueAsNumber,
          }))
        }
        value={timersConfigs.sufixChance}
        showEdit={showEdit}
      />
    </>
  );
}
