import ConfigInput from "./ConfigInput";
import ConfigButton from "./ConfigButton";
import { ConfigsDispatchActionType, ConfigsWrapperSharedProps } from "./types";
import { useConfigsContext } from "./ConfigsContext";

const DISPATCH_TYPE = ConfigsDispatchActionType.SET_MUSIC;

export default function MusicConfigsWrapper({
  showEdit,
}: ConfigsWrapperSharedProps) {
  const {
    configState: [{ musicConfigs }, dispatch],
  } = useConfigsContext();

  return (
    <>
      <ConfigButton
        optionName="Song request"
        setState={() =>
          dispatch({
            type: DISPATCH_TYPE,
            payload: {
              ...musicConfigs,
              songRequest: !musicConfigs.songRequest,
            },
          })
        }
        value={musicConfigs.songRequest}
        showEdit={showEdit}
      />
      <ConfigInput
        optionName="Max auto que size"
        setState={(e) =>
          dispatch({
            type: DISPATCH_TYPE,
            payload: {
              ...musicConfigs,
              maxAutoQueSize: e.target.valueAsNumber,
            },
          })
        }
        value={musicConfigs.maxAutoQueSize}
        showEdit={showEdit}
      />
      <ConfigInput
        optionName="Max song request by user"
        setState={(e) =>
          dispatch({
            type: DISPATCH_TYPE,
            payload: {
              ...musicConfigs,
              maxSongRequestByUser: e.target.valueAsNumber,
            },
          })
        }
        value={musicConfigs.maxSongRequestByUser}
        showEdit={showEdit}
      />
    </>
  );
}
