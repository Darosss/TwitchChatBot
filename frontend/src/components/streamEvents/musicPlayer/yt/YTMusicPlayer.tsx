import { useCallback, useState } from "react";
import YTPlaylist from "./YTPlaylist";
import Modal from "@components/modal";

enum AvailableTabs {
  PLAYLISTS = "playlists",
  NONE = "none",
}

export default function YTMusicPlayer() {
  const [activeTab, setActiveTab] = useState<AvailableTabs>(AvailableTabs.NONE);

  const generateMusicPlayerContext = () => {
    switch (activeTab) {
      case AvailableTabs.PLAYLISTS:
        return <YTPlaylist />;
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
