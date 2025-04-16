import { useDispatch, useSelector } from "react-redux";
import ConfigInput from "./ConfigInput";
import { setPointsConfigs } from "@redux/configsSlice";
import { RootStore } from "@redux/store";

export default function PointsConfigsWrapper() {
  const dispatch = useDispatch();
  const {
    isUpdateMode,
    config: { pointsConfigs },
  } = useSelector((state: RootStore) => state.configs);

  return (
    <>
      <div className="configs-section-inner-header">Points increment</div>

      <ConfigInput
        optionName="Message"
        setState={(e) =>
          dispatch(
            setPointsConfigs([
              "pointsIncrement",
              {
                ...pointsConfigs.pointsIncrement,
                message: e.currentTarget.valueAsNumber,
              },
            ])
          )
        }
        value={pointsConfigs.pointsIncrement.message}
        showEdit={isUpdateMode}
      />
      <ConfigInput
        optionName="Watch"
        setState={(e) =>
          dispatch(
            setPointsConfigs([
              "pointsIncrement",
              {
                ...pointsConfigs.pointsIncrement,
                watch: e.currentTarget.valueAsNumber,
              },
            ])
          )
        }
        value={pointsConfigs.pointsIncrement.watch}
        showEdit={isUpdateMode}
      />
      <ConfigInput
        optionName="Watch multipler"
        setState={(e) =>
          dispatch(
            setPointsConfigs([
              "pointsIncrement",
              {
                ...pointsConfigs.pointsIncrement,
                watchMultipler: e.currentTarget.valueAsNumber,
              },
            ])
          )
        }
        value={pointsConfigs.pointsIncrement.watchMultipler}
        showEdit={isUpdateMode}
      />
    </>
  );
}
