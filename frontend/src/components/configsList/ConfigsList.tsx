import React, { useContext, useEffect, useState } from "react";

import PreviousPage from "@components/previousPage";
import {
  getConfigs,
  editConfig,
  TimersConfigs,
  CommandsConfigs,
  ChatGamesConfigs,
  TriggersConfigs,
  PointsConfigs,
  LoyaltyConfigs,
  HeadConfigs,
  MusicConfigs,
  resetConfigs,
} from "@services/ConfigService";
import { SocketContext } from "@context/SocketContext";
import { addNotification } from "@utils/getNotificationValues";
import {
  chatGamesConfigsInitial,
  commandsConfigsInitial,
  headConfigsInitial,
  loyaltyConfigsInitial,
  musicConfigsInitial,
  pointsConfigsInitial,
  timersConfigsInitial,
  triggersConfigsInitial,
} from "./initialState";
import CommandsConfigsWrapper from "./CommandsConfigs";
import TimersConfigsWrapper from "./TimersConfigs";
import ChatGamesConfigsWrapper from "./ChatGamesConfigs";
import TriggersConfigsWrapper from "./TriggersConfigs.tsx";
import PointsConfigsWrapper from "./PointsConfigs";
import LoyaltyConfigsWrapper from "./LoyaltyConfigs";
import MusicConfigsWrapper from "./MusicConfigs";
import HeadConfigsWrapper from "./HeadConfigs";

export default function ConfigsList() {
  const socket = useContext(SocketContext);

  const [showEdit, setShowEdit] = useState(false);

  const [commandsCfg, setCommandsCfg] = useState<CommandsConfigs>(
    commandsConfigsInitial
  );
  const [timersCfg, setTimersCfg] =
    useState<TimersConfigs>(timersConfigsInitial);
  const [chatGamesCfg, setChatGamesCfg] = useState<ChatGamesConfigs>(
    chatGamesConfigsInitial
  );
  const [triggersCfg, setTriggersCfg] = useState<TriggersConfigs>(
    triggersConfigsInitial
  );
  const [pointsCfg, setPointsCfg] =
    useState<PointsConfigs>(pointsConfigsInitial);
  const [loyaltyCfg, setLoyaltyCfg] = useState<LoyaltyConfigs>(
    loyaltyConfigsInitial
  );
  const [musicCfg, setMusicCfg] = useState<MusicConfigs>(musicConfigsInitial);
  const [headCfg, setHeadCfg] = useState<HeadConfigs>(headConfigsInitial);

  const {
    data,
    loading,
    error,
    refetchData: refetchConfigsData,
  } = getConfigs();

  const { data: resetCfgData, refetchData: resetConfigsToDefaults } =
    resetConfigs();

  const { refetchData: fetchEditConfig } = editConfig({
    commandsConfigs: commandsCfg,
    timersConfigs: timersCfg,
    chatGamesConfigs: chatGamesCfg,
    triggersConfigs: triggersCfg,
    pointsConfigs: pointsCfg,
    loyaltyConfigs: loyaltyCfg,
    musicConfigs: musicCfg,
    headConfigs: headCfg,
  });

  useEffect(() => {
    if (!data) return;
    const {
      commandsConfigs,
      timersConfigs,
      chatGamesConfigs,
      triggersConfigs,
      pointsConfigs,
      loyaltyConfigs,
      musicConfigs,
      headConfigs,
    } = data;
    setCommandsCfg(commandsConfigs);
    setTimersCfg(timersConfigs);
    setChatGamesCfg(chatGamesConfigs);
    setTriggersCfg(triggersConfigs);
    setPointsCfg(pointsConfigs);
    setLoyaltyCfg(loyaltyConfigs);
    setMusicCfg(musicConfigs);
    setHeadCfg(headConfigs);
  }, [data]);

  const setConfigStates = () => {};

  const onClickEditConfig = () => {
    setShowEdit(false);
    fetchEditConfig().then(() => {
      socket.emit("saveConfigs");
      refetchConfigsData();
      addNotification("Succes", "Configs edited succesfully", "success");
    });
  };

  const onClickResetConfigs = () => {
    if (confirm("Are you sure you want reset configs to defaults?")) {
      resetConfigsToDefaults().then(() => {
        refetchConfigsData();
        socket.emit("saveConfigs");
      });
    }
  };

  if (error) return <>There is an error.</>;
  if (!data || loading) return <>Someting went wrong</>;
  return (
    <>
      <PreviousPage />
      <div>
        <button
          className="common-button primary-button"
          onClick={() => {
            setConfigStates();
            setShowEdit((prevState) => {
              return !prevState;
            });
          }}
        >
          Edit
        </button>
        {showEdit ? (
          <>
            <button
              className="common-button danger-button"
              onClick={() => onClickEditConfig()}
            >
              Save
            </button>
            <button
              className="common-button danger-button"
              onClick={() => onClickResetConfigs()}
            >
              Reset to defaults
            </button>
          </>
        ) : null}
      </div>
      <div className="configs-list-wrapper">
        <div className="configs-section-wrapper">
          <div className="configs-section-header">Commands options </div>
          <CommandsConfigsWrapper
            commandsState={[commandsCfg, setCommandsCfg]}
            showEdit={showEdit}
          />
        </div>
        <div className="configs-section-wrapper">
          <div className="configs-section-header">Timers configs</div>
          <TimersConfigsWrapper
            timersState={[timersCfg, setTimersCfg]}
            showEdit={showEdit}
          />
        </div>
        <div className="configs-section-wrapper">
          <div className="configs-section-header">Chat games configs</div>
          <ChatGamesConfigsWrapper
            chatGamesState={[chatGamesCfg, setChatGamesCfg]}
            showEdit={showEdit}
          />
        </div>
        <div className="configs-section-wrapper">
          <div className="configs-section-header">Triggers configs</div>
          <TriggersConfigsWrapper
            triggersState={[triggersCfg, setTriggersCfg]}
            showEdit={showEdit}
          />
        </div>
        <div className="configs-section-wrapper">
          <div className="configs-section-header">Points configs</div>
          <PointsConfigsWrapper
            pointsState={[pointsCfg, setPointsCfg]}
            showEdit={showEdit}
          />
        </div>
        <div className="configs-section-wrapper">
          <div className="configs-section-header">Loyalty configs</div>
          <LoyaltyConfigsWrapper
            loyaltyState={[loyaltyCfg, setLoyaltyCfg]}
            showEdit={showEdit}
          />
        </div>
        <div className="configs-section-wrapper">
          <div className="configs-section-header">Music configs</div>
          <MusicConfigsWrapper
            musicState={[musicCfg, setMusicCfg]}
            showEdit={showEdit}
          />
        </div>
        <div className="configs-section-wrapper">
          <div className="configs-section-header">Head configs</div>
          <HeadConfigsWrapper
            headState={[headCfg, setHeadCfg]}
            showEdit={showEdit}
          />
        </div>
      </div>
    </>
  );
}
