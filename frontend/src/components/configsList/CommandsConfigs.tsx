import { setCommandsConfigs } from "@redux/configsSlice";
import ConfigInput from "./ConfigInput";
import { useDispatch, useSelector } from "react-redux";
import { RootStore } from "@redux/store";
export default function CommandsConfigsWrapper() {
  const dispatch = useDispatch();
  const {
    isUpdateMode,
    config: { commandsConfigs },
  } = useSelector((state: RootStore) => state.configs);

  return (
    <>
      <ConfigInput
        optionName="Commands prefix"
        setState={(e) =>
          dispatch(
            setCommandsConfigs(["commandsPrefix", e.currentTarget.value])
          )
        }
        value={commandsConfigs.commandsPrefix}
        showEdit={isUpdateMode}
        inputType="text"
      />
    </>
  );
}
