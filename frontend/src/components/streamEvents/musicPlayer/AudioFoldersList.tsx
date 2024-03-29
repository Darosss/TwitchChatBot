import React, { useEffect, useState } from "react";
import { useSocketContext } from "@socket";
import {
  useDeleteMp3File,
  useGetFolderMp3Files,
  useGetFoldersList,
} from "@services";
import { useAxiosWithConfirmation } from "@hooks";
export default function AudioFoldersList() {
  const socketContext = useSocketContext();
  const [folderName, setFolderName] = useState("");

  const { data: foldersData } = useGetFoldersList("music");

  const { data: mp3Data, refetchData: refetchMp3Files } =
    useGetFolderMp3Files(folderName);

  const handleOnClickChangeFolder = (folder: string) => {
    setFolderName(folder);
  };
  const setFolderAndFileNameToDelete = useAxiosWithConfirmation({
    hookToProceed: useDeleteMp3File,
    opts: {
      onFullfiled: () => refetchMp3Files(),
    },
  });

  useEffect(() => {
    if (!folderName) return;
    refetchMp3Files();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folderName]);

  useEffect(() => {
    const {
      emits: { getAudioInfo },
    } = socketContext;

    getAudioInfo((cb) => {
      setFolderName(cb.currentFolder);
    });
  }, [socketContext]);

  if (!foldersData) return <> No folders.</>;

  const { data: folders } = foldersData;

  return (
    <div className="audio-files-list-wrapper">
      <div className="audio-folders-list-wrapper">
        {folders.map((folder, index) => (
          <button
            key={index}
            onClick={() => handleOnClickChangeFolder(folder)}
            className={`common-button ${
              folder === folderName ? "primary-button" : "danger-button"
            }`}
          >
            {folder}
          </button>
        ))}
      </div>
      {folderName ? (
        <button
          onClick={() => {
            socketContext.emits.loadSongs(folderName);
          }}
          className="load-folder-btn common-button primary-button"
        >
          Load {folderName}
        </button>
      ) : null}
      <div className="mp3-files-wrapper">
        {mp3Data?.data.map((mp3, index) => (
          <div key={index} className="mp3-file list-with-x-buttons">
            <div>
              <button
                onClick={() =>
                  setFolderAndFileNameToDelete({ folderName, fileName: mp3 })
                }
                className="common-button danger-button"
              >
                x
              </button>
            </div>
            <div> {mp3} </div>
          </div>
        ))}
      </div>
    </div>
  );
}
