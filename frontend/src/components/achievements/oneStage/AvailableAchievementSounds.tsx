import { useFileUpload } from "@hooks";
import ProgressBar from "@ramonak/react-progress-bar";
import { useGetAchievementStagesSoundsBasePath } from "@services";
import { addErrorNotification, addSuccessNotification } from "@utils";
import { useEffect, useState } from "react";
import { viteBackendUrl } from "@configs/envVariables";

interface OnClickSoundType {
  basePath: string;
  soundName: string;
}

interface AvailableAchievementSoundsProps {
  soundPaths: string[];
  onClickSound: ({ basePath, soundName }: OnClickSoundType) => void;
  onClickRefresh: () => void;
  currentSoundPath?: string;
  className?: string;
}

export default function AvailableAchievementSounds({
  soundPaths,
  onClickSound,
  onClickRefresh,
  currentSoundPath,
  className,
}: AvailableAchievementSoundsProps) {
  const { data: basePathData } = useGetAchievementStagesSoundsBasePath();
  const [filterSoundNames, setFilterSoundNames] = useState("");

  if (!basePathData) return <>No base path sounds</>;
  return (
    <div className={`achievement-stages-sounds-wrapper ${className}`}>
      <div className="action-items-wrapper">
        <UploadAchievementStageSoundButtons
          onSuccessCallback={onClickRefresh}
        />
        <button
          className="common-button tertiary-button"
          onClick={onClickRefresh}
        >
          Refresh
        </button>
        <input
          type="text"
          placeholder="search"
          onChange={(e) => setFilterSoundNames(e.target.value.toLowerCase())}
        />
        {currentSoundPath ? (
          <div className="action-item-audio-wrapper">
            <audio controls src={`${viteBackendUrl}\\${currentSoundPath}`} />
          </div>
        ) : null}
      </div>
      <div className="achievement-stage-sounds-list-wrapper">
        {soundPaths
          .filter((path) => {
            if (!filterSoundNames) return true;
            if (path.toLowerCase().includes(filterSoundNames)) return true;
            return false;
          })
          .map((path, index) => (
            <div
              key={index}
              className={`one-achievement-stage-sounds-wrapper ${
                currentSoundPath?.includes(path) ? "current-sound" : ""
              }
        
              `}
              onClick={() =>
                onClickSound({ basePath: basePathData.data, soundName: path })
              }
            >
              <div className="achievement-stage-sounds-name">{path}</div>
            </div>
          ))}
      </div>
    </div>
  );
}

interface UploadAchievementStageSoundButtonsProps {
  onSuccessCallback: () => void;
}
//TODO: there is similar UploadBadgeImageButtons - merge them maybe later
function UploadAchievementStageSoundButtons({
  onSuccessCallback,
}: UploadAchievementStageSoundButtonsProps) {
  const [showUploadSound, setShowUploadSound] = useState(false);

  const { uploadProgress, handleFileUpload, error, success } = useFileUpload(
    "achievements/stages/sounds/upload"
  );

  useEffect(() => {
    if (success) {
      addSuccessNotification("Uploaded achievement stages sound to server");
      onSuccessCallback();
    }
  }, [success]);

  useEffect(() => {
    if (error) addErrorNotification(error);
  }, [error]);

  return (
    <>
      <button
        className="common-button primary-button"
        onClick={() => setShowUploadSound(!showUploadSound)}
      >
        {showUploadSound ? "Hide upload" : "New"}
      </button>

      {showUploadSound ? (
        <div>
          <div>Upload</div>
          <div>
            <input
              type="file"
              name="file"
              accept=".mp3"
              onChange={(e) => handleFileUpload({ event: e }, "uploaded_file")}
              multiple
            />
            <div>
              <ProgressBar completed={uploadProgress} labelAlignment="center" />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
