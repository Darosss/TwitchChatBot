import React, { useState } from "react";
import PreviousPage from "@components/previousPage";
import { TableListWrapper } from "@components/tableWrapper";
import Modal from "@components/modal";
import ModalBadgesList from "../badges/ModalBadgesList";
import { useAchievementStageContext } from "./Context";
import BaseDetailsAchievementStage from "./BaseDetailsAchievementStage";
import ActionButtons from "./ActionButtons";
import AchievementStageTheadData from "./AchievementStageTheadData";
import AchievementStageEditData from "./AchievementStageEditData";
import AchievementStageDisplayData from "./AchievementStageDisplayData";

export default function OneAchievementStageData() {
  const {
    achievementStageState: [state],
    updateStageDataByIndex,
  } = useAchievementStageContext();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [currentEditingStageData, setCurrentEditingStageData] = useState(-1);

  return (
    <>
      <PreviousPage />
      <div className="one-achievement-stage-data">
        <div className="default-data">
          <div>
            <ActionButtons
              editing={editing}
              onCancelEdit={() => setEditing(false)}
              onClickEdit={() => setEditing(true)}
              onClickSave={() => setEditing(false)}
            />
          </div>
          <div className="base-details-achievement-stage-wrapper">
            <BaseDetailsAchievementStage editing={editing} />
          </div>
        </div>

        <div className="stage-data-wrapper">
          <TableListWrapper
            theadChildren={<AchievementStageTheadData />}
            tbodyChildren={
              editing ? (
                <AchievementStageEditData
                  onClickBadge={(index) => {
                    setCurrentEditingStageData(index);
                    setShowModal(true);
                  }}
                />
              ) : (
                <AchievementStageDisplayData />
              )
            }
          />
        </div>
      </div>

      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <ModalBadgesList
          onClickBadge={(badge) => {
            updateStageDataByIndex(currentEditingStageData, {
              ...state.stageData[currentEditingStageData],
              badge: badge,
            });
            setShowModal(false);
          }}
        />
      </Modal>
    </>
  );
}
