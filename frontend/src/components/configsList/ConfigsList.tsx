import { useEffect, useState } from "react";

import PreviousPage from "@components/previousPage";
import { useGetConfigs } from "@services";
import CommandsConfigsWrapper from "./CommandsConfigs";
import TimersConfigsWrapper from "./TimersConfigs";
import ChatGamesConfigsWrapper from "./ChatGamesConfigs";
import TriggersConfigsWrapper from "./TriggersConfigs";
import PointsConfigsWrapper from "./PointsConfigs";
import LoyaltyConfigsWrapper from "./LoyaltyConfigs";
import MusicConfigsWrapper from "./MusicConfigs";
import HeadConfigsWrapper from "./HeadConfigs";
import EditConfigs from "./EditConfigs";
import Error from "@components/axiosHelper/errors";
import { Loading } from "@components/axiosHelper";
import { useDispatch } from "react-redux";
import { setConfigState } from "@redux/configsSlice";

enum ConfigsListTabNames {
  HEAD = "Head options",
  COMMANDS = "Commands options",
  TIMERS = "Timers options",
  CHAT_GAMES = "Chat games options",
  TRIGGERS = "Triggers options",
  POINTS = "Points options",
  LOYALTY = "Loyalty options",
  MUSIC = "Music options",
}

export default function ConfigsList() {
  const dispatch = useDispatch();

  const [currentTab, setCurrentTab] = useState<ConfigsListTabNames>(
    ConfigsListTabNames.HEAD
  );

  const { data: configs, isLoading, error } = useGetConfigs();
  useEffect(() => {
    if (!configs) return;
    dispatch(setConfigState(configs.data));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configs]);

  if (error) return <Error error={error} />;
  if (isLoading || !configs) return <Loading />;

  const renderTabComponent = () => {
    switch (currentTab) {
      case ConfigsListTabNames.COMMANDS:
        return <CommandsConfigsWrapper />;
      case ConfigsListTabNames.TIMERS:
        return <TimersConfigsWrapper />;
      case ConfigsListTabNames.CHAT_GAMES:
        return <ChatGamesConfigsWrapper />;
      case ConfigsListTabNames.TRIGGERS:
        return <TriggersConfigsWrapper />;
      case ConfigsListTabNames.POINTS:
        return <PointsConfigsWrapper />;
      case ConfigsListTabNames.LOYALTY:
        return <LoyaltyConfigsWrapper />;
      case ConfigsListTabNames.MUSIC:
        return <MusicConfigsWrapper />;
      case ConfigsListTabNames.HEAD:
        return <HeadConfigsWrapper />;
    }
  };

  return (
    <>
      <PreviousPage />
      <EditConfigs />

      <div className="configs-list-tab-list-wrapper">
        {Object.values(ConfigsListTabNames).map((tabName, index) => (
          <button
            key={index}
            className={`${
              currentTab === tabName ? "primary-button" : "danger-button"
            }`}
            onClick={() => setCurrentTab(tabName)}
          >
            {tabName}
          </button>
        ))}
      </div>
      <div className="configs-list-wrapper">
        <div className="configs-section-wrapper">
          <div className="configs-section-header">{currentTab} </div>
          {renderTabComponent()}
        </div>
      </div>
    </>
  );
}
