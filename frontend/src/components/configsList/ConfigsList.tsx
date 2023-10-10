import React, { useEffect, useState } from "react";

import PreviousPage from "@components/previousPage";
import {
  useGetConfigs,
  useEditConfig,
  useResetConfigs,
} from "@services/ConfigService";
import { useSocketContext } from "@context/socket";
import { addNotification } from "@utils/getNotificationValues";
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

export default function ConfigsList() {
  const {
    emits: { saveConfigs },
  } = useSocketContext();

  const {
    configState: [configsState, dispatchConfigState],
  } = useConfigsContext();

  const [showEdit, setShowEdit] = useState(false);

  const {
    data,
    loading,
    error,
    refetchData: refetchConfigsData,
  } = useGetConfigs();

  const { refetchData: resetConfigsToDefaults } = useResetConfigs();

  const { refetchData: fetchEditConfig } = useEditConfig(configsState);

  useEffect(() => {
    if (!data) return;

    dispatchConfigState({
      type: ConfigsDispatchActionType.SET_STATE,
      payload: data,
    });
  }, [data, dispatchConfigState]);

  const onClickEditConfig = () => {
    setShowEdit(false);
    fetchEditConfig().then(() => {
      saveConfigs();
      refetchConfigsData();
      addNotification("Success", "Configs edited succesfully", "success");
    });
  };

  const onClickResetConfigs = () => {
    if (window.confirm("Are you sure you want reset configs to defaults?")) {
      resetConfigsToDefaults().then(() => {
        refetchConfigsData();
        saveConfigs();
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
          <CommandsConfigsWrapper showEdit={showEdit} />
        </div>
        <div className="configs-section-wrapper">
          <div className="configs-section-header">Timers configs</div>
          <TimersConfigsWrapper showEdit={showEdit} />
        </div>
        <div className="configs-section-wrapper">
          <div className="configs-section-header">Chat games configs</div>
          <ChatGamesConfigsWrapper showEdit={showEdit} />
        </div>
        <div className="configs-section-wrapper">
          <div className="configs-section-header">Triggers configs</div>
          <TriggersConfigsWrapper showEdit={showEdit} />
        </div>
        <div className="configs-section-wrapper">
          <div className="configs-section-header">Points configs</div>
          <PointsConfigsWrapper showEdit={showEdit} />
        </div>
        <div className="configs-section-wrapper">
          <div className="configs-section-header">Loyalty configs</div>
          <LoyaltyConfigsWrapper showEdit={showEdit} />
        </div>
        <div className="configs-section-wrapper">
          <div className="configs-section-header">Music configs</div>
          <MusicConfigsWrapper showEdit={showEdit} />
        </div>
        <div className="configs-section-wrapper">
          <div className="configs-section-header">Head configs</div>
          <HeadConfigsWrapper showEdit={showEdit} />
        </div>
      </div>
    </>
  );
}
