import { PointsConfigs } from "@services/ConfigService";
import ConfigInput from "./ConfigInput";
export default function PointsConfigsWrapper(props: {
  pointsState: [
    PointsConfigs,
    React.Dispatch<React.SetStateAction<PointsConfigs>>
  ];
  showEdit: boolean;
}) {
  const { pointsState, showEdit } = props;
  const [pointsConfigs, setPointsConfigs] = pointsState;
  return (
    <>
      <div className="configs-section-inner-header">Points increment</div>

      <ConfigInput
        optionName="Message"
        setState={(e) =>
          setPointsConfigs((prevState) => ({
            ...prevState,
            pointsIncrement: {
              ...prevState.pointsIncrement,
              message: e.target.valueAsNumber,
            },
          }))
        }
        value={pointsConfigs.pointsIncrement.message}
        showEdit={showEdit}
      />
      <ConfigInput
        optionName="Watch"
        setState={(e) =>
          setPointsConfigs((prevState) => ({
            ...prevState,
            pointsIncrement: {
              ...prevState.pointsIncrement,
              watch: e.target.valueAsNumber,
            },
          }))
        }
        value={pointsConfigs.pointsIncrement.watch}
        showEdit={showEdit}
      />
      <ConfigInput
        optionName="Watch multipler"
        setState={(e) =>
          setPointsConfigs((prevState) => ({
            ...prevState,
            pointsIncrement: {
              ...prevState.pointsIncrement,
              watchMultipler: e.target.valueAsNumber,
            },
          }))
        }
        value={pointsConfigs.pointsIncrement.watchMultipler}
        showEdit={showEdit}
      />
    </>
  );
}
