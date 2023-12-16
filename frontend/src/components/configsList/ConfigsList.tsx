import React, { useEffect, useState } from "react";

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
import { useConfigsContext } from "./ConfigsContext";
import { ConfigsDispatchActionType } from "./types";
import EditConfigs from "./EditConfigs";

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
  const {
    configState: [, dispatchConfigState],
  } = useConfigsContext();

  const [showEdit, setShowEdit] = useState(false);
  const [currentTab, setCurrentTab] = useState<ConfigsListTabNames>(
    ConfigsListTabNames.HEAD
  );

  const {
    data,
    loading,
    error,
    refetchData: refetchConfigsData,
  } = useGetConfigs();

  useEffect(() => {
    if (!data) return;

    dispatchConfigState({
      type: ConfigsDispatchActionType.SET_STATE,
      payload: data.data,
    });
  }, [data, dispatchConfigState]);

  if (error) return <>There is an error.</>;
  if (!data || loading) return <>Someting went wrong</>;

  const renderTabComponent = () => {
    switch (currentTab) {
      case ConfigsListTabNames.COMMANDS:
        return <CommandsConfigsWrapper showEdit={showEdit} />;
      case ConfigsListTabNames.TIMERS:
        return <TimersConfigsWrapper showEdit={showEdit} />;
      case ConfigsListTabNames.CHAT_GAMES:
        return <ChatGamesConfigsWrapper showEdit={showEdit} />;
      case ConfigsListTabNames.TRIGGERS:
        return <TriggersConfigsWrapper showEdit={showEdit} />;
      case ConfigsListTabNames.POINTS:
        return <PointsConfigsWrapper showEdit={showEdit} />;
      case ConfigsListTabNames.LOYALTY:
        return <LoyaltyConfigsWrapper showEdit={showEdit} />;
      case ConfigsListTabNames.MUSIC:
        return <MusicConfigsWrapper showEdit={showEdit} />;
      case ConfigsListTabNames.HEAD:
        return <HeadConfigsWrapper showEdit={showEdit} />;
    }
  };

  return (
    <>
      <PreviousPage />
      <EditConfigs
        showEdit={showEdit}
        onClickShowEdit={() => setShowEdit(!showEdit)}
        onClickSaveConfigs={() => {
          refetchConfigsData();
          setShowEdit(!showEdit);
        }}
        onClickDefaultConfigs={() => {
          refetchConfigsData();
          setShowEdit(!showEdit);
        }}
      />

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
