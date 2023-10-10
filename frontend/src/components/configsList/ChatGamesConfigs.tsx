import ConfigInput from "./ConfigInput";
import { useConfigsContext } from "./ConfigsContext";
import { ConfigsDispatchActionType, ConfigsWrapperSharedProps } from "./types";

const DISPATCH_TYPE = ConfigsDispatchActionType.SET_CHAT_GAMES;

export default function ChatGamesConfigsWrapper({
  showEdit,
}: ConfigsWrapperSharedProps) {
  const {
    configState: [{ chatGamesConfigs }, dispatch],
  } = useConfigsContext();

  return (
    <>
      <ConfigInput
        optionName="Max time active user"
        setState={(e) =>
          dispatch({
            type: DISPATCH_TYPE,
            payload: {
              ...chatGamesConfigs,
              activeUserTimeDelay: e.target.valueAsNumber,
            },
          })
        }
        value={chatGamesConfigs.activeUserTimeDelay}
        showEdit={showEdit}
      />
      <ConfigInput
        optionName="Chat games interval delay"
        setState={(e) =>
          dispatch({
            type: DISPATCH_TYPE,
            payload: {
              ...chatGamesConfigs,
              chatGamesIntervalDelay: e.target.valueAsNumber,
            },
          })
        }
        value={chatGamesConfigs.chatGamesIntervalDelay}
        showEdit={showEdit}
      />
      <ConfigInput
        optionName="Minimum active users threshhold"
        setState={(e) =>
          dispatch({
            type: DISPATCH_TYPE,
            payload: {
              ...chatGamesConfigs,
              minActiveUsersThreshold: e.target.valueAsNumber,
            },
          })
        }
        value={chatGamesConfigs.minActiveUsersThreshold}
        showEdit={showEdit}
      />
    </>
  );
}
