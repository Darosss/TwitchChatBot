import { ChatGamesConfigs } from "@services/ConfigService";
import ConfigInput from "./ConfigInput";
export default function ChatGamesConfigsWrapper(props: {
  chatGamesState: [
    ChatGamesConfigs,
    React.Dispatch<React.SetStateAction<ChatGamesConfigs>>
  ];
  showEdit: boolean;
}) {
  const { chatGamesState, showEdit } = props;
  const [chatGamesConfigs, setChatGamesConfigs] = chatGamesState;
  return (
    <>
      <ConfigInput
        optionName="Max time active user"
        setState={(e) =>
          setChatGamesConfigs((prevState) => ({
            ...prevState,
            activeUserTimeDelay: e.target.valueAsNumber,
          }))
        }
        value={chatGamesConfigs.activeUserTimeDelay}
        showEdit={showEdit}
      />
      <ConfigInput
        optionName="Chat games interval delay"
        setState={(e) =>
          setChatGamesConfigs((prevState) => ({
            ...prevState,
            chatGamesIntervalDelay: e.target.valueAsNumber,
          }))
        }
        value={chatGamesConfigs.chatGamesIntervalDelay}
        showEdit={showEdit}
      />
      <ConfigInput
        optionName="Minimum active users threshhold"
        setState={(e) =>
          setChatGamesConfigs((prevState) => ({
            ...prevState,
            minActiveUsersThreshold: e.target.valueAsNumber,
          }))
        }
        value={chatGamesConfigs.minActiveUsersThreshold}
        showEdit={showEdit}
      />
    </>
  );
}
