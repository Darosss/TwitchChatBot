import { CommandsConfigs } from "@services/ConfigService";
import ConfigInput from "./ConfigInput";
export default function CommandsConfigsWrapper(props: {
  commandsState: [
    CommandsConfigs,
    React.Dispatch<React.SetStateAction<CommandsConfigs>>
  ];
  showEdit: boolean;
}) {
  const { commandsState, showEdit } = props;
  const [commandsConfigs, setCommandsConfigs] = commandsState;
  return (
    <>
      <ConfigInput
        optionName="Commands prefix"
        setState={(e) =>
          setCommandsConfigs((prevState) => ({
            ...prevState,
            commandsPrefix: e.target.value,
          }))
        }
        value={commandsConfigs.commandsPrefix}
        showEdit={showEdit}
        inputType="text"
      />
    </>
  );
}
