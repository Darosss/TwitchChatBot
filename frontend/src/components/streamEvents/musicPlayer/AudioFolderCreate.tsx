import React, { useEffect, useState } from "react";
import {
  useCreateAudioFolder,
  useDeleteAudioFolder,
  useGetFoldersList,
} from "@services";
import { addSuccessNotification, handleActionOnChangeState } from "@utils";

export default function AudioFolderCreate() {
  const [folderName, setFolderName] = useState("");
  const [folderToDelete, setFolderToDelete] = useState<string | null>(null);

  const { data: foldersData, refetchData: refetchFolders } =
    useGetFoldersList();

  const { refetchData: fetchCreateFolder } = useCreateAudioFolder(folderName);

  const { refetchData: fetchDeleteFolder } = useDeleteAudioFolder(
    folderToDelete || ""
  );

  useEffect(() => {
    handleActionOnChangeState(folderToDelete, setFolderToDelete, () => {
      fetchDeleteFolder().then(() => {
        refetchFolders();
        addSuccessNotification("Folder deleted successfully");
        setFolderToDelete(null);
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        {foldersData?.data.map((folder, index) => (
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
        ))}
      </div>
    </div>
  );
}
