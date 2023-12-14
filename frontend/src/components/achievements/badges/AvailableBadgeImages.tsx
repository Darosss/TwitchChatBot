import { useFileUpload } from "@hooks";
import ProgressBar from "@ramonak/react-progress-bar";
import {
  GetBagesImagesResponseData,
  useGetBadgesIamgesBasePath,
} from "@services";
import { addErrorNotification, addSuccessNotification } from "@utils";
import { useEffect, useState } from "react";
import { viteBackendUrl } from "src/configs/envVariables";

export interface OnClickBadgeType {
  basePath: string;
  badgeName: string;
  badgeExtension: string;
}

interface AvailableBadgeImagesProps {
  badgesData: GetBagesImagesResponseData;
  onClickBadge: ({
    basePath,
    badgeName,
    badgeExtension,
  }: OnClickBadgeType) => void;
  onClickRefresh: () => void;
  currentImgPath?: string;
  className?: string;
  showNames?: boolean;
}

export default function AvailableBadgeImages({
  badgesData,
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
        {badgesData.imagesPaths
          .filter(([name]) => {
            if (!filterBadgesNames) return true;
            if (name.toLowerCase().includes(filterBadgesNames)) return true;
            return false;
          })
          .map(([name, extension], index) => (
            <div
              key={index}
              className="one-badge-image-wrapper"
              onClick={() =>
                onClickBadge({
                  basePath: basePathData.data,
                  badgeName: name,
                  badgeExtension: extension,
                })
              }
            >
              {showNames ? (
                <div className="badge-name">{name}</div>
              ) : (
                <div className="image-name-tooltip">{name}</div>
              )}
              <img
                src={`${viteBackendUrl}/${basePathData.data}\\${name}${extension}`}
                className={`${
                  currentImgPath?.includes(name) ? "current-image" : ""
                }`}
                alt={name}
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
      addSuccessNotification(success);
      onSuccessCallback();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success]);

  useEffect(() => {
    if (error) addErrorNotification(error);
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
