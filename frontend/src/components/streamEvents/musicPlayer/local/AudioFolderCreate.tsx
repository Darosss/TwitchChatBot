import { useState } from "react";
import {
  useCreateAudioFolder,
  useDeleteAudioFolder,
  useGetFoldersList,
} from "@services";
import "./audio-folder-create-style.scss";

export default function AudioFolderCreate() {
  const [folderName, setFolderName] = useState("");

  const { data: foldersData } = useGetFoldersList();

  const createAudioFolderMutation = useCreateAudioFolder();

  const deleteAudioFolderMutation = useDeleteAudioFolder();

  const handleCreateFolder = (name: string) => {
    createAudioFolderMutation.mutate(name);
  };
  const handleDeleteFolder = (name: string) => {
    if (
      !window.confirm(
        `Are you sure you want to delete the folder with name: ${name}?`
      )
    )
      return;
    deleteAudioFolderMutation.mutate(name);
  };

  return (
    <div className="folders-create-wrapper">
      <div className="folders-create-actions">
        <input type="text" onChange={(e) => setFolderName(e.target.value)} />
        <button
          className="primary-button common-button"
          onClick={() => handleCreateFolder(folderName)}
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
                  onClick={() => handleDeleteFolder(folder)}
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
