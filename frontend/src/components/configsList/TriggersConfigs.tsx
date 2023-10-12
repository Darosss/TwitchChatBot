import ConfigInput from "./ConfigInput";
import { useConfigsContext } from "./ConfigsContext";
import { ConfigsDispatchActionType, ConfigsWrapperSharedProps } from "./types";

const DISPATCH_TYPE = ConfigsDispatchActionType.SET_TRIGGERS;

export default function TriggersConfigsWrapper({
  showEdit,
}: ConfigsWrapperSharedProps) {
  const {
    configState: [{ triggersConfigs }, dispatch],
  } = useConfigsContext();

  return (
    <>
      <ConfigInput
        optionName="Random message chance"
        setState={(e) =>
          dispatch({
            type: DISPATCH_TYPE,
            payload: {
              ...triggersConfigs,
              randomMessageChance: e.target.valueAsNumber,
            },
          })
        }
        value={triggersConfigs.randomMessageChance}
        showEdit={showEdit}
      />
      <ConfigInput
        optionName="Prefix chances"
        setState={(e) =>
          dispatch({
            type: DISPATCH_TYPE,
            payload: {
              ...triggersConfigs,
              prefixChance: e.target.valueAsNumber,
            },
          })
        }
        value={triggersConfigs.prefixChance}
        showEdit={showEdit}
      />
      <ConfigInput
        optionName="Sufix chances"
        setState={(e) =>
          dispatch({
            type: DISPATCH_TYPE,
            payload: {
              ...triggersConfigs,
              suffixChance: e.target.valueAsNumber,
            },
          })
        }
        value={triggersConfigs.suffixChance}
        showEdit={showEdit}
      />
    </>
  );
}
