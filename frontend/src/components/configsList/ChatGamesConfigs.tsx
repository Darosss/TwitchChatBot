import { setChatGamesConfigs } from "@redux/configsSlice";
import { RootStore } from "@redux/store";
import ConfigInput from "./ConfigInput";
import { useDispatch, useSelector } from "react-redux";

export default function ChatGamesConfigsWrapper() {
  const dispatch = useDispatch();
  const {
    isUpdateMode,
    config: { chatGamesConfigs },
  } = useSelector((state: RootStore) => state.configs);

  return (
    <>
      <ConfigInput
        optionName="Max time active user"
        setState={(e) =>
          dispatch(
            setChatGamesConfigs([
              "activeUserTimeDelay",
              e.currentTarget.valueAsNumber,
            ])
          )
        }
        value={chatGamesConfigs.activeUserTimeDelay}
        showEdit={isUpdateMode}
      />
      <ConfigInput
        optionName="Chat games interval delay"
        setState={(e) =>
          dispatch(
            setChatGamesConfigs([
              "chatGamesIntervalDelay",
              e.currentTarget.valueAsNumber,
            ])
          )
        }
        value={chatGamesConfigs.chatGamesIntervalDelay}
        showEdit={isUpdateMode}
      />
      <ConfigInput
        optionName="Minimum active users threshhold"
        setState={(e) =>
          dispatch(
            setChatGamesConfigs([
              "minActiveUsersThreshold",
              e.currentTarget.valueAsNumber,
            ])
          )
        }
        value={chatGamesConfigs.minActiveUsersThreshold}
        showEdit={isUpdateMode}
      />
    </>
  );
}
