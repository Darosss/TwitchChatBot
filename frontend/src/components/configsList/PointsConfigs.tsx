import ConfigInput from "./ConfigInput";
import { useConfigsContext } from "./ConfigsContext";
import { ConfigsDispatchActionType, ConfigsWrapperSharedProps } from "./types";

const DISPATCH_TYPE = ConfigsDispatchActionType.SET_POINTS;

export default function PointsConfigsWrapper({
  showEdit,
}: ConfigsWrapperSharedProps) {
  const {
    configState: [{ pointsConfigs }, dispatch],
  } = useConfigsContext();

  return (
    <>
      <div className="configs-section-inner-header">Points increment</div>

      <ConfigInput
        optionName="Message"
        setState={(e) =>
          dispatch({
            type: DISPATCH_TYPE,
            payload: {
              ...pointsConfigs,
              pointsIncrement: {
                ...pointsConfigs.pointsIncrement,
                message: e.target.valueAsNumber,
              },
            },
          })
        }
        value={pointsConfigs.pointsIncrement.message}
        showEdit={showEdit}
      />
      <ConfigInput
        optionName="Watch"
        setState={(e) =>
          dispatch({
            type: DISPATCH_TYPE,
            payload: {
              ...pointsConfigs,
              pointsIncrement: {
                ...pointsConfigs.pointsIncrement,
                watch: e.target.valueAsNumber,
              },
            },
          })
        }
        value={pointsConfigs.pointsIncrement.watch}
        showEdit={showEdit}
      />
      <ConfigInput
        optionName="Watch multipler"
        setState={(e) =>
          dispatch({
            type: DISPATCH_TYPE,
            payload: {
              ...pointsConfigs,
              pointsIncrement: {
                ...pointsConfigs.pointsIncrement,
                watchMultipler: e.target.valueAsNumber,
              },
            },
          })
        }
        value={pointsConfigs.pointsIncrement.watchMultipler}
        showEdit={showEdit}
      />
    </>
  );
}
