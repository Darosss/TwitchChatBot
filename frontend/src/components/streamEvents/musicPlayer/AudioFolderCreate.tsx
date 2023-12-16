import React, { useState } from "react";
import {
  useCreateAudioFolder,
  useDeleteAudioFolder,
  useGetFoldersList,
} from "@services";
import { useAxiosWithConfirmation } from "@hooks";

export default function AudioFolderCreate() {
  const [folderName, setFolderName] = useState("");

  const { data: foldersData, refetchData: refetchFolders } =
    useGetFoldersList("music");

  const { refetchData: fetchCreateFolder } = useCreateAudioFolder(folderName);

  const setFolderNameToDelete = useAxiosWithConfirmation({
    hookToProceed: useDeleteAudioFolder,
    opts: { onFullfiled: () => refetchFolders() },
  });

  const handleCreateButton = () => {
    fetchCreateFolder();
    refetchFolders();
  };

  return (
    <div className="folders-create-wrapper">
      <div>
        <input type="text" onChange={(e) => setFolderName(e.target.value)} />
        <button
          className="primary-button common-button"
          onClick={() => handleCreateButton()}
        >
          Create folder
        </button>
      </div>
      <div className="folders-create-list">
        {foldersData?.data.map((folder, index) => (
          <div key={index} className="folder-file list-with-x-buttons">
            <div>
              <button
                onClick={() => setFolderNameToDelete(folder)}
                className="common-button danger-button"
              >
                x
              </button>
            </div>
            <div> {folder} </div>
          </div>
        ))}
      </div>
    </div>
  );
}
