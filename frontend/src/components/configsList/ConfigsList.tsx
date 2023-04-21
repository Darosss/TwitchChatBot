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
} from "@services/ConfigService";
import { SocketContext } from "@context/SocketContext";
import { addNotification } from "@utils/getNotificationValues";
import { configDefaults } from "@backend/defaults/configsDefaults";
export default function ConfigsList() {
  const socket = useContext(SocketContext);

  const [showEdit, setShowEdit] = useState(false);

  const [commandsCfg, setCommandsCfg] = useState<CommandsConfigs>(
    configDefaults.commandsConfigs
  );
  const [timersCfg, setTimersCfg] = useState<TimersConfigs>(
    configDefaults.timersConfigs
  );
  const [chatGamesCfg, setChatGamesCfg] = useState<ChatGamesConfigs>(
    configDefaults.chatGamesConfigs
  );
  const [triggersCfg, setTriggersCfg] = useState<TriggersConfigs>(
    configDefaults.triggersConfigs
  );
  const [pointsCfg, setPointsCfg] = useState<PointsConfigs>(
    configDefaults.pointsConfigs
  );
  const [loyaltyCfg, setLoyaltyCfg] = useState<LoyaltyConfigs>(
    configDefaults.loyaltyConfigs
  );
  const [musicCfg, setMusicCfg] = useState<MusicConfigs>(
    configDefaults.musicConfigs
  );
  const [headCfg, setHeadCfg] = useState<HeadConfigs>(
    configDefaults.headConfigs
  );

  const { data, loading, error, refetchData } = getConfigs();

  const { refetchData: fetchEditConfig } = editConfig({
    commandsConfigs: commandsCfg!,
    timersConfigs: timersCfg!,
    chatGamesConfigs: chatGamesCfg!,
    triggersConfigs: triggersCfg!,
    pointsConfigs: pointsCfg!,
    loyaltyConfigs: loyaltyCfg!,
    musicConfigs: musicCfg!,
    headConfigs: headCfg!,
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
      socket?.emit("saveConfigs");
      refetchData();
      addNotification("Succes", "Configs edited succesfully", "success");
    });
  };

  const generateConfigInput = (
    optionName: string,
    input: React.ReactNode,
    value: string | number
  ) => {
    return (
      <>
        <div> {optionName} </div>
        <div>{showEdit ? input : value}</div>
      </>
    );
  };
  if (error) return <>There is an error.</>;
  if (!data || loading) return <>Someting went wrong</>;
  return (
    <>
      <PreviousPage />
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
        <button
          className="common-button danger-button"
          onClick={() => onClickEditConfig()}
        >
          Save
        </button>
      ) : null}
      <div className="configs-list-wrapper">
        <div className="configs-section-wrapper">
          <div className="configs-section-header">Commands options </div>
          {generateConfigInput(
            "Commands prefix",
            <input
              type="text"
              value={commandsCfg?.commandsPrefix}
              onChange={(e) =>
                setCommandsCfg((prevState) => ({
                  ...prevState,
                  commandsPrefix: e.target.value,
                }))
              }
            />,
            commandsCfg?.commandsPrefix
          )}
        </div>
        <div className="configs-section-wrapper">
          <div className="configs-section-header">Timers configs</div>
          {generateConfigInput(
            "Timers interval delay",
            <input
              type="number"
              value={timersCfg?.timersIntervalDelay}
              onChange={(e) =>
                setTimersCfg((prevState) => ({
                  ...prevState,
                  timersIntervalDelay: e.target.valueAsNumber,
                }))
              }
            />,
            timersCfg?.timersIntervalDelay
          )}
          {generateConfigInput(
            "Non follow timers points increment",
            <input
              type="number"
              value={timersCfg?.nonFollowTimerPoints}
              onChange={(e) =>
                setTimersCfg((prevState) => ({
                  ...prevState,
                  nonFollowTimerPoints: e.target.valueAsNumber,
                }))
              }
            />,
            timersCfg?.nonFollowTimerPoints
          )}
          {generateConfigInput(
            "Non sub timers points increment",
            <input
              type="number"
              value={timersCfg?.nonSubTimerPoints}
              onChange={(e) =>
                setTimersCfg((prevState) => ({
                  ...prevState,
                  nonSubTimerPoints: e.target.valueAsNumber,
                }))
              }
            />,
            timersCfg?.nonSubTimerPoints
          )}
          {generateConfigInput(
            "Prefix chances",
            <input
              type="number"
              value={timersCfg?.prefixChance}
              onChange={(e) =>
                setTimersCfg((prevState) => ({
                  ...prevState,
                  prefixChance: e.target.valueAsNumber,
                }))
              }
            />,
            timersCfg?.prefixChance
          )}

          {generateConfigInput(
            "Sufix chances",
            <input
              type="number"
              value={timersCfg?.sufixChance}
              onChange={(e) =>
                setTimersCfg((prevState) => ({
                  ...prevState,
                  sufixChance: e.target.valueAsNumber,
                }))
              }
            />,
            timersCfg?.sufixChance
          )}
        </div>
        <div className="configs-section-wrapper">
          <div className="configs-section-header">Chat games configs</div>
          {generateConfigInput(
            "Max time active user",
            <input
              type="number"
              value={chatGamesCfg?.activeUserTimeDelay}
              onChange={(e) =>
                setChatGamesCfg((prevState) => ({
                  ...prevState,
                  activeUserTimeDelay: e.target.valueAsNumber,
                }))
              }
            />,
            chatGamesCfg?.activeUserTimeDelay
          )}
          {generateConfigInput(
            "Chat games interval delay",
            <input
              type="number"
              value={chatGamesCfg?.chatGamesIntervalDelay}
              onChange={(e) =>
                setChatGamesCfg((prevState) => ({
                  ...prevState,
                  chatGamesIntervalDelay: e.target.valueAsNumber,
                }))
              }
            />,
            chatGamesCfg?.chatGamesIntervalDelay
          )}
          {generateConfigInput(
            "Minimum active users threshhold",
            <input
              type="number"
              value={chatGamesCfg?.minActiveUsersThreshold}
              onChange={(e) =>
                setChatGamesCfg((prevState) => ({
                  ...prevState,
                  minActiveUsersThreshold: e.target.valueAsNumber,
                }))
              }
            />,
            chatGamesCfg?.minActiveUsersThreshold
          )}
        </div>
        <div className="configs-section-wrapper">
          <div className="configs-section-header">Triggers configs</div>
          {generateConfigInput(
            "Random message chance",
            <input
              type="number"
              value={triggersCfg?.randomMessageChance}
              onChange={(e) =>
                setTriggersCfg((prevState) => ({
                  ...prevState,
                  randomMessageChance: e.target.valueAsNumber,
                }))
              }
            />,
            triggersCfg?.randomMessageChance
          )}
          {generateConfigInput(
            "Prefix chances",
            <input
              type="number"
              value={triggersCfg?.prefixChance}
              onChange={(e) =>
                setTriggersCfg((prevState) => ({
                  ...prevState,
                  prefixChance: e.target.valueAsNumber,
                }))
              }
            />,
            triggersCfg?.prefixChance
          )}

          {generateConfigInput(
            "Sufix chances",
            <input
              type="number"
              value={triggersCfg?.sufixChance}
              onChange={(e) =>
                setTriggersCfg((prevState) => ({
                  ...prevState,
                  sufixChance: e.target.valueAsNumber,
                }))
              }
            />,
            triggersCfg?.sufixChance
          )}
        </div>
        <div className="configs-section-wrapper">
          <div className="configs-section-header">Points configs</div>
          <div className="configs-section-inner-header">Points increment</div>
          {generateConfigInput(
            "Message",
            <input
              type="number"
              value={pointsCfg?.pointsIncrement.message}
              onChange={(e) =>
                setPointsCfg((prevState) => ({
                  ...prevState,
                  pointsIncrement: {
                    ...prevState.pointsIncrement,
                    message: e.target.valueAsNumber,
                  },
                }))
              }
            />,
            pointsCfg?.pointsIncrement.message
          )}
          {generateConfigInput(
            "Watch",
            <input
              type="number"
              value={pointsCfg?.pointsIncrement.watch}
              onChange={(e) =>
                setPointsCfg((prevState) => ({
                  ...prevState,
                  pointsIncrement: {
                    ...prevState.pointsIncrement,
                    watch: e.target.valueAsNumber,
                  },
                }))
              }
            />,
            pointsCfg?.pointsIncrement.watch
          )}
          {generateConfigInput(
            "Watch multipler",
            <input
              type="number"
              value={pointsCfg?.pointsIncrement.watchMultipler}
              onChange={(e) =>
                setPointsCfg((prevState) => ({
                  ...prevState,
                  pointsIncrement: {
                    ...prevState.pointsIncrement,
                    watchMultipler: e.target.valueAsNumber,
                  },
                }))
              }
            />,
            pointsCfg?.pointsIncrement.watchMultipler
          )}
        </div>
        <div className="configs-section-wrapper">
          <div className="configs-section-header">Loyalty configs</div>
          {generateConfigInput(
            "Interval check chatters delay",
            <input
              type="number"
              value={loyaltyCfg?.intervalCheckChatters}
              onChange={(e) =>
                setLoyaltyCfg((prevState) => ({
                  ...prevState,
                  intervalCheckChatters: e.target.valueAsNumber,
                }))
              }
            />,
            loyaltyCfg?.intervalCheckChatters
          )}
        </div>
        <div className="configs-section-wrapper">
          <div className="configs-section-header">Music configs</div>
          {generateConfigInput(
            "Song request",
            <button
              onClick={(e) =>
                setMusicCfg((prevState) => ({
                  ...prevState,
                  songRequest: !prevState.songRequest,
                }))
              }
            >
              {musicCfg.songRequest.toString()}
            </button>,
            musicCfg.songRequest.toString()
          )}
          {generateConfigInput(
            "Max auto que size",
            <input
              type="number"
              value={musicCfg.maxAutoQueSize}
              onChange={(e) =>
                setMusicCfg((prevState) => ({
                  ...prevState,
                  maxAutoQueSize: e.target.valueAsNumber,
                }))
              }
            />,
            musicCfg.maxAutoQueSize
          )}
          {generateConfigInput(
            "Max song request by user",
            <input
              type="number"
              value={musicCfg.maxSongRequestByUser}
              onChange={(e) =>
                setMusicCfg((prevState) => ({
                  ...prevState,
                  maxSongRequestByUser: e.target.valueAsNumber,
                }))
              }
            />,
            musicCfg.maxSongRequestByUser
          )}
        </div>
        <div className="configs-section-wrapper">
          <div className="configs-section-header">Head configs</div>
          {generateConfigInput(
            "Interval check viewers peek delay",
            <input
              type="number"
              value={headCfg?.intervalCheckViewersPeek}
              onChange={(e) =>
                setHeadCfg((prevState) => ({
                  ...prevState,
                  intervalCheckViewersPeek: e.target.valueAsNumber,
                }))
              }
            />,
            headCfg?.intervalCheckViewersPeek
          )}

          <div className="configs-section-inner-header">
            Delay between messages in ms
          </div>
          {generateConfigInput(
            "Min",
            <input
              type="number"
              value={headCfg?.delayBetweenMessages.min}
              onChange={(e) =>
                setHeadCfg((prevState) => ({
                  ...prevState,
                  delayBetweenMessages: {
                    ...prevState.delayBetweenMessages,
                    min: e.target.valueAsNumber,
                  },
                }))
              }
            />,
            headCfg?.delayBetweenMessages.min
          )}
          {generateConfigInput(
            "Max",
            <input
              type="number"
              value={headCfg?.delayBetweenMessages.max}
              onChange={(e) =>
                setHeadCfg((prevState) => ({
                  ...prevState,
                  delayBetweenMessages: {
                    ...prevState.delayBetweenMessages,
                    max: e.target.valueAsNumber,
                  },
                }))
              }
            />,
            headCfg?.delayBetweenMessages.max
          )}

          <div className="configs-section-inner-header">Permissions levels</div>
          {generateConfigInput(
            "Broadcaster",
            <input
              type="number"
              value={headCfg?.permissionLevels.broadcaster}
              onChange={(e) =>
                setHeadCfg((prevState) => ({
                  ...prevState,
                  permissionLevels: {
                    ...prevState.permissionLevels,
                    broadcaster: e.target.valueAsNumber,
                  },
                }))
              }
            />,
            headCfg?.permissionLevels.broadcaster
          )}
          {generateConfigInput(
            "Mod",
            <input
              type="number"
              value={headCfg?.permissionLevels.mod}
              onChange={(e) =>
                setHeadCfg((prevState) => ({
                  ...prevState,
                  permissionLevels: {
                    ...prevState.permissionLevels,
                    mod: e.target.valueAsNumber,
                  },
                }))
              }
            />,
            headCfg?.permissionLevels.mod
          )}
          {generateConfigInput(
            "Vip",
            <input
              type="number"
              value={headCfg?.permissionLevels.vip}
              onChange={(e) =>
                setHeadCfg((prevState) => ({
                  ...prevState,
                  permissionLevels: {
                    ...prevState.permissionLevels,
                    vip: e.target.valueAsNumber,
                  },
                }))
              }
            />,
            headCfg?.permissionLevels.vip
          )}
          {generateConfigInput(
            "All",
            <input
              type="number"
              value={headCfg?.permissionLevels.all}
              onChange={(e) =>
                setHeadCfg((prevState) => ({
                  ...prevState,
                  permissionLevels: {
                    ...prevState.permissionLevels,
                    all: e.target.valueAsNumber,
                  },
                }))
              }
            />,
            headCfg?.permissionLevels.all
          )}
        </div>
      </div>
    </>
  );
}
