import {
  createAudioFolder,
  deleteAudioFolder,
  getFoldersList,
} from "@services/FilesService";
import { addNotification } from "@utils/getNotificationValues";
import { handleActionOnChangeState } from "@utils/handleDeleteApi";
import React, { useContext, useEffect, useState } from "react";

export default function AudioFolderCreate() {
  const [folderName, setFolderName] = useState("");
  const [folderToDelete, setFolderToDelete] = useState<string | null>(null);

  const {
    data: foldersData,
    loading: foldersLoad,
    error: foldersError,
    refetchData: refetchFolders,
  } = getFoldersList();

  const { refetchData: fetchCreateFolder } = createAudioFolder(folderName);

  const { refetchData: fetchDeleteFolder } = deleteAudioFolder(
    folderToDelete || ""
  );

  useEffect(() => {
    handleActionOnChangeState(folderToDelete, setFolderToDelete, () => {
      fetchDeleteFolder().then(() => {
        refetchFolders();
        addNotification("Deleted", "Folder deleted successfully", "danger");
        setFolderToDelete(null);
      });
    });
  }, [folderToDelete]);

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
        {foldersData?.data.map((folder, index) => {
          return (
            <div key={index} className="folder-file list-with-x-buttons">
              <div>
                <button
                  onClick={() => setFolderToDelete(folder)}
                  className="common-button danger-button"
                >
                  x
                </button>
              </div>
              <div> {folder} </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
