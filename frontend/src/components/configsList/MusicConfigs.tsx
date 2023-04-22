import { MusicConfigs } from "@services/ConfigService";
import ConfigInput from "./ConfigInput";
import ConfigButton from "./ConfigButton";
export default function MusicConfigsWrapper(props: {
  musicState: [
    MusicConfigs,
    React.Dispatch<React.SetStateAction<MusicConfigs>>
  ];
  showEdit: boolean;
}) {
  const { musicState, showEdit } = props;
  const [musicConfigs, setMusicConfigs] = musicState;
  return (
    <>
      <ConfigButton
        optionName="Song request"
        setState={(e) =>
          setMusicConfigs((prevState) => ({
            ...prevState,
            songRequest: !prevState.songRequest,
          }))
        }
        value={musicConfigs.songRequest}
        showEdit={showEdit}
      />
      <ConfigInput
        optionName="Max auto que size"
        setState={(e) =>
          setMusicConfigs((prevState) => ({
            ...prevState,
            maxAutoQueSize: e.target.valueAsNumber,
          }))
        }
        value={musicConfigs.maxAutoQueSize}
        showEdit={showEdit}
      />
      <ConfigInput
        optionName="Max song request by user"
        setState={(e) =>
          setMusicConfigs((prevState) => ({
            ...prevState,
            maxSongRequestByUser: e.target.valueAsNumber,
          }))
        }
        value={musicConfigs.maxSongRequestByUser}
        showEdit={showEdit}
      />
    </>
  );
}
