import { TriggersConfigs } from "@services/ConfigService";
import ConfigInput from "./ConfigInput";
export default function TriggersConfigsWrapper(props: {
  triggersState: [
    TriggersConfigs,
    React.Dispatch<React.SetStateAction<TriggersConfigs>>
  ];
  showEdit: boolean;
}) {
  const { triggersState, showEdit } = props;
  const [triggersConfigs, setTriggersConfigs] = triggersState;
  return (
    <>
      <ConfigInput
        optionName="Random message chance"
        setState={(e) =>
          setTriggersConfigs((prevState) => ({
            ...prevState,
            randomMessageChance: e.target.valueAsNumber,
          }))
        }
        value={triggersConfigs.randomMessageChance}
        showEdit={showEdit}
      />
      <ConfigInput
        optionName="Prefix chances"
        setState={(e) =>
          setTriggersConfigs((prevState) => ({
            ...prevState,
            prefixChance: e.target.valueAsNumber,
          }))
        }
        value={triggersConfigs.prefixChance}
        showEdit={showEdit}
      />
      <ConfigInput
        optionName="Sufix chances"
        setState={(e) =>
          setTriggersConfigs((prevState) => ({
            ...prevState,
            sufixChance: e.target.valueAsNumber,
          }))
        }
        value={triggersConfigs.suffixChance}
        showEdit={showEdit}
      />
    </>
  );
}
