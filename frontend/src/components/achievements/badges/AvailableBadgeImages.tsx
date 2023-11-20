import { useFileUpload } from "@hooks";
import ProgressBar from "@ramonak/react-progress-bar";
import { useGetBadgesIamgesBasePath } from "@services";
import { addNotification } from "@utils";
import { useEffect, useState } from "react";
import { viteBackendUrl } from "src/configs/envVariables";

interface OnClickBadgeType {
  basePath: string;
  badgeName: string;
}

interface AvailableBadgeImagesProps {
  badgePaths: string[];
  onClickBadge: ({ basePath, badgeName }: OnClickBadgeType) => void;
  onClickRefresh: () => void;
  currentImgPath?: string;
  className?: string;
  showNames?: boolean;
}

export default function AvailableBadgeImages({
  badgePaths,
  onClickBadge,
  onClickRefresh,
  currentImgPath,
  className,
  showNames,
}: AvailableBadgeImagesProps) {
  const { data: basePathData } = useGetBadgesIamgesBasePath();
  const [filterBadgesNames, setFilterBadgesNames] = useState("");

  if (!basePathData) return <> No base path data. </>;
  return (
    <div className={`available-badge-images-wrapper ${className}`}>
      <div>{currentImgPath}</div>

      <div className="action-items-wrapper">
        <UploadBadgeImageButtons onSuccessCallback={onClickRefresh} />
        <button
          className="common-button tertiary-button"
          onClick={onClickRefresh}
        >
          Refresh
        </button>
        <input
          type="text"
          placeholder="search"
          onChange={(e) => setFilterBadgesNames(e.target.value.toLowerCase())}
        />
      </div>
      <div className="badge-images-list-wrapper">
        {badgePaths
          .filter((path) => {
            if (!filterBadgesNames) return true;
            if (path.toLowerCase().includes(filterBadgesNames)) return true;
            return false;
          })
          .map((path, index) => (
            <div
              key={index}
              className="one-badge-image-wrapper"
              onClick={() =>
                onClickBadge({ basePath: basePathData.data, badgeName: path })
              }
            >
              {showNames ? <div className="badge-name">{path}</div> : null}
              <img
                src={`${viteBackendUrl}/${basePathData.data}\\${path}`}
                className={`${
                  currentImgPath?.includes(path) ? "current-image" : ""
                }`}
                alt={path}
              />
            </div>
          ))}
      </div>
    </div>
  );
}

interface UploadBadgeImageButtonsProps {
  onSuccessCallback: () => void;
}
//TODO: there is similar UploadAchievementStageSoundButtons - merge them maybe later
function UploadBadgeImageButtons({
  onSuccessCallback,
}: UploadBadgeImageButtonsProps) {
  const [showUploadImages, setShowUploadImages] = useState(false);

  const { uploadProgress, handleFileUpload, error, success } = useFileUpload(
    "achievements/badges/images/upload"
  );

  useEffect(() => {
    if (success) {
      addNotification("Uploaded badge images to server", success, "success");
      onSuccessCallback();
    }
  }, [success]);

  useEffect(() => {
    if (error) addNotification("Danger", error, "danger");
  }, [error]);

  return (
    <>
      <button
        className="common-button primary-button"
        onClick={() => setShowUploadImages(!showUploadImages)}
      >
        {showUploadImages ? "Hide upload" : "New"}
      </button>

      {showUploadImages ? (
        <div>
          <div>Upload</div>
          <div>
            <input
              type="file"
              name="file"
              accept="image/png, image/jpg, image/jpeg, image/gif"
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
