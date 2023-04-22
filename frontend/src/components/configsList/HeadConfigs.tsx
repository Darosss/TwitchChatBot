import { HeadConfigs } from "@services/ConfigService";
import ConfigInput from "./ConfigInput";
export default function HeadConfigsWrapper(props: {
  headState: [HeadConfigs, React.Dispatch<React.SetStateAction<HeadConfigs>>];
  showEdit: boolean;
}) {
  const { headState, showEdit } = props;
  const [headConfigs, setHeadConfigs] = headState;
  return (
    <>
      <ConfigInput
        optionName="Interval check viewers peek delay"
        setState={(e) =>
          setHeadConfigs((prevState) => ({
            ...prevState,
            intervalCheckViewersPeek: e.target.valueAsNumber,
          }))
        }
        value={headConfigs.intervalCheckViewersPeek}
        showEdit={showEdit}
      />
      <div className="configs-section-inner-header">
        Delay between messages in ms
      </div>
      <ConfigInput
        optionName="Min"
        setState={(e) =>
          setHeadConfigs((prevState) => ({
            ...prevState,
            delayBetweenMessages: {
              ...prevState.delayBetweenMessages,
              min: e.target.valueAsNumber,
            },
          }))
        }
        value={headConfigs.delayBetweenMessages.min}
        showEdit={showEdit}
      />
      <ConfigInput
        optionName="Max"
        setState={(e) =>
          setHeadConfigs((prevState) => ({
            ...prevState,
            delayBetweenMessages: {
              ...prevState.delayBetweenMessages,
              max: e.target.valueAsNumber,
            },
          }))
        }
        value={headConfigs.delayBetweenMessages.max}
        showEdit={showEdit}
      />
      <div className="configs-section-inner-header">Permissions levels</div>
      <ConfigInput
        optionName="Broadcaster"
        setState={(e) =>
          setHeadConfigs((prevState) => ({
            ...prevState,
            permissionLevels: {
              ...prevState.permissionLevels,
              broadcaster: e.target.valueAsNumber,
            },
          }))
        }
        value={headConfigs.permissionLevels.broadcaster}
        showEdit={showEdit}
      />
      <ConfigInput
        optionName="Mod"
        setState={(e) =>
          setHeadConfigs((prevState) => ({
            ...prevState,
            permissionLevels: {
              ...prevState.permissionLevels,
              mod: e.target.valueAsNumber,
            },
          }))
        }
        value={headConfigs.permissionLevels.mod}
        showEdit={showEdit}
      />
      <ConfigInput
        optionName="Vip"
        setState={(e) =>
          setHeadConfigs((prevState) => ({
            ...prevState,
            permissionLevels: {
              ...prevState.permissionLevels,
              vip: e.target.valueAsNumber,
            },
          }))
        }
        value={headConfigs.permissionLevels.vip}
        showEdit={showEdit}
      />
      <ConfigInput
        optionName="All"
        setState={(e) =>
          setHeadConfigs((prevState) => ({
            ...prevState,
            permissionLevels: {
              ...prevState.permissionLevels,
              all: e.target.valueAsNumber,
            },
          }))
        }
        value={headConfigs.permissionLevels.all}
        showEdit={showEdit}
      />
    </>
  );
}
