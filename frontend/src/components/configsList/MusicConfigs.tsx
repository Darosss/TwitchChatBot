import ConfigInput from "./ConfigInput";
import ConfigButton from "./ConfigButton";
import { useDispatch, useSelector } from "react-redux";
import { RootStore } from "@redux/store";
import { setMusicConfigs } from "@redux/configsSlice";

export default function MusicConfigsWrapper() {
  const dispatch = useDispatch();
  const {
    isUpdateMode,
    config: { musicConfigs },
  } = useSelector((state: RootStore) => state.configs);

  return (
    <>
      <ConfigButton
        optionName="Song request"
        setState={(e) =>
          dispatch(setMusicConfigs(["songRequest", !musicConfigs.songRequest]))
        }
        value={musicConfigs.songRequest}
        showEdit={isUpdateMode}
      />
      <ConfigInput
        optionName="Max auto que size"
        setState={(e) =>
          dispatch(
            setMusicConfigs(["maxAutoQueSize", e.currentTarget.valueAsNumber])
          )
        }
        value={musicConfigs.maxAutoQueSize}
        showEdit={isUpdateMode}
      />
      <ConfigInput
        optionName="Max song request by user"
        setState={(e) =>
          dispatch(
            setMusicConfigs([
              "maxSongRequestByUser",
              e.currentTarget.valueAsNumber,
            ])
          )
        }
        value={musicConfigs.maxSongRequestByUser}
        showEdit={isUpdateMode}
      />
    </>
  );
}
