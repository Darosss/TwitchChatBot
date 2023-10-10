import ConfigInput from "./ConfigInput";
import { useConfigsContext } from "./ConfigsContext";
import { ConfigsDispatchActionType, ConfigsWrapperSharedProps } from "./types";

const DISPATCH_TYPE = ConfigsDispatchActionType.SET_COMMANDS;

export default function CommandsConfigsWrapper({
  showEdit,
}: ConfigsWrapperSharedProps) {
  const {
    configState: [{ commandsConfigs }, dispatch],
  } = useConfigsContext();

  return (
    <>
      <ConfigInput
        optionName="Commands prefix"
        setState={(e) =>
          dispatch({
            type: DISPATCH_TYPE,
            payload: {
              ...commandsConfigs,
              commandsPrefix: e.target.value,
            },
          })
        }
        value={commandsConfigs.commandsPrefix}
        showEdit={showEdit}
        inputType="text"
      />
    </>
  );
}
