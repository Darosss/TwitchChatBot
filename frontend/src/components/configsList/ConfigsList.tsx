import React, { useEffect, useState } from "react";

import PreviousPage from "@components/previousPage";
import { useGetConfigs } from "@services/ConfigService";
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

export default function ConfigsList() {
  const {
    configState: [, dispatchConfigState],
  } = useConfigsContext();

  const [showEdit, setShowEdit] = useState(false);

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
      payload: data,
    });
  }, [data, dispatchConfigState]);

  if (error) return <>There is an error.</>;
  if (!data || loading) return <>Someting went wrong</>;
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
