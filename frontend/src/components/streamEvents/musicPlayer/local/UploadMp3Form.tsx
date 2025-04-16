import { useEffect, useState } from "react";
import { addNotification } from "@utils";
import ProgressBar from "@ramonak/react-progress-bar";
import { uploadMp3Data, useGetFoldersList } from "@services";
import "./upload-mp3-form-style.scss";
import { useFileUpload } from "@hooks";

export default function UploadMp3Form() {
  const [fileList, setFileList] = useState<FileList | null>(null);
  const [folderName, setFolderName] = useState("");

  const { data: foldersData } = useGetFoldersList();

  const { uploadProgress, handleFileUpload, error, success } = useFileUpload(
    uploadMp3Data.endpoint(folderName)
  );

  useEffect(() => {
    if (success) addNotification("Uploaded files to sever", success, "success");
  }, [success]);

  useEffect(() => {
    if (error) addNotification("Danger", error, "danger");
  }, [error]);

  if (!foldersData) return <> No folders to upload </>;

  const { data: folders } = foldersData;

  return (
    <>
      <div className="upload-mp3-form-wrapper">
        <div className="upload-folder-buttons-wrapper">
          <div>Upload to:</div>
          <div className="upload-folder-buttons">
            {folders.map((folder, index) => {
              return (
                <button
                  className={`common-button ${
                    folderName === folder ? "primary-button" : "danger-button"
                  }`}
                  key={index}
                  onClick={() => setFolderName(folder)}
                >
                  {folder}
                </button>
              );
            })}
          </div>
        </div>
        {folderName ? (
          <div className="upload-input-file">
            <input
              type="file"
              name="file"
              onChange={(e) => {
                setFileList(e.target.files);
                handleFileUpload({ event: e }, uploadMp3Data.uploadName);
              }}
              multiple
            />
            <div className="upload-mp3-progrees-bar">
              <ProgressBar completed={uploadProgress} labelAlignment="center" />
            </div>
          </div>
        ) : null}

        <div className="upload-files-list">
          {fileList ? (
            <ul>
              {[...fileList].map((file, i) => (
                <li key={i}>
                  {file.name} - {file.type}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </>
  );
}
