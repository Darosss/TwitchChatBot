import { SocketContext } from "@context/SocketContext";
import {
  deleteMp3File,
  getFolderMp3Files,
  getFoldersList,
} from "@services/FilesService";
import { addNotification } from "@utils/getNotificationValues";
import { handleActionOnChangeState } from "@utils/handleDeleteApi";
import React, { useContext, useEffect, useState } from "react";
export default function AudioFoldersList() {
  const socket = useContext(SocketContext);
  const [folderName, setFolderName] = useState("");
  const [fileNameToDelete, setFileNameToDelete] = useState<string | null>(null);

  const {
    data: foldersData,
    loading: foldersLoad,
    error: foldersError,
    refetchData: refetchFolders,
  } = getFoldersList();

  const {
    data: mp3Data,
    loading: mp3Load,
    error: mp3Error,
    refetchData: refetchMp3Files,
  } = getFolderMp3Files(folderName);

  const { refetchData: fetchDeleteFile } = deleteMp3File(
    folderName,
    fileNameToDelete || ""
  );

  const emitLoadSongs = () => {
    socket.emit("loadSongs", folderName);
  };

  const handleOnClickChangeFolder = (folder: string) => {
    setFolderName(folder);
  };

  useEffect(() => {
    handleActionOnChangeState(fileNameToDelete, setFileNameToDelete, () => {
      fetchDeleteFile().then(() => {
        refetchMp3Files();
        addNotification("Deleted", "File deleted successfully", "danger");
        setFileNameToDelete(null);
      });
    });
  }, [fileNameToDelete]);

  useEffect(() => {
    if (!folderName) return;

    refetchMp3Files();
  }, [folderName]);

  useEffect(() => {
    console.log(mp3Data);
  }, [mp3Data]);

  if (!foldersData) return <> No folders.</>;

  const { data: folders } = foldersData;

  return (
    <div className="audio-files-list-wrapper">
      <div className="audio-folders-list-wrapper">
        {folders.map((folder, index) => {
          return (
            <div key={index}>
              <button
                onClick={() => handleOnClickChangeFolder(folder)}
                className="common-button primary-button"
              >
                {folder}
              </button>
            </div>
          );
        })}
        <button
          onClick={() => {
            emitLoadSongs();
          }}
          className="load-folder-btn common-button danger-button"
        >
          Load {folderName}
        </button>
      </div>

      <div className="mp3-files-wrapper">
        {mp3Data?.data.map((mp3, index) => {
          return (
            <div key={index} className="mp3-file">
              <div>
                <button
                  onClick={() => setFileNameToDelete(mp3)}
                  className="common-button danger-button"
                >
                  x
                </button>
              </div>
              <div> {mp3} </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
