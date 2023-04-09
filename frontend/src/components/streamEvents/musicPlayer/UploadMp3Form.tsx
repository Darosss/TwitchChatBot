import React, { useEffect, useState } from "react";
import useFileUpload from "@hooks/useFileUpload";
import { addNotification } from "@utils/getNotificationValues";
import ProgressBar from "@ramonak/react-progress-bar";
export default function UploadMp3Form() {
  const [fileList, setFileList] = useState<FileList | null>(null);
  const { uploadProgress, handleFileUpload, error, success } = useFileUpload(
    "files/upload/audio-mp3"
  );

  useEffect(() => {
    if (success) addNotification("Uploaded files to sever", success, "success");
  }, [success]);

  useEffect(() => {
    if (error) addNotification("Danger", error, "danger");
  }, [error]);

  return (
    <>
      <div className="upload-mp3-form-wrapper">
        <input
          type="file"
          name="file"
          onChange={(e) => {
            setFileList(e.target.files);
            handleFileUpload(e);
          }}
          multiple
        />
        <div className="upload-mp3-progrees-bar">
          <ProgressBar completed={uploadProgress} labelAlignment="center" />
        </div>
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
