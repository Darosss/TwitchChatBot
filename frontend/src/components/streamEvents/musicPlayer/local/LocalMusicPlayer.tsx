import { useCallback, useState } from "react";
import AudioFolderCreate from "./AudioFolderCreate";
import AudioFoldersList from "./AudioFoldersList";
import UploadMp3Form from "./UploadMp3Form";
import Modal from "@components/modal";

enum AvailableTabs {
  UPLOAD = "upload",
  MUSIC = "music",
  FOLDERS = "folders",
  NONE = "none",
}

export default function LocalMusicPlayer() {
  const [activeTab, setActiveTab] = useState<AvailableTabs>(AvailableTabs.NONE);

  const generateMusicPlayerContext = () => {
    switch (activeTab) {
      case AvailableTabs.UPLOAD:
        return <UploadMp3Form />;
      case AvailableTabs.MUSIC:
        return <AudioFoldersList />;
      case AvailableTabs.FOLDERS:
        return <AudioFolderCreate />;
    }
  };

  const ytButtons = useCallback(
    () =>
      Object.values(AvailableTabs).map((tab) =>
        tab !== AvailableTabs.NONE ? (
          <button
            key={tab}
            className={`common-button switch-players-button ${
              activeTab === tab ? "primary-button" : "tertiary-button"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ) : null
      ),
    [activeTab]
  );

  return (
    <div>
      <div className="music-player-tabs-wrapper">{ytButtons()}</div>
      <Modal
        title={activeTab}
        onClose={() => setActiveTab(AvailableTabs.NONE)}
        onSubmit={() => setActiveTab(AvailableTabs.NONE)}
        show={activeTab !== AvailableTabs.NONE}
      >
        {generateMusicPlayerContext()}
      </Modal>
    </div>
  );
}
