import { useState } from "react";
import PreviousPage from "@components/previousPage";
import { TableListWrapper } from "@components/tableWrapper";
import Modal from "@components/modal";
import ModalBadgesList from "../badges/ModalBadgesList";
import BaseDetailsAchievementStage from "./BaseDetailsAchievementStage";
import ActionButtons from "./ActionButtons";
import AchievementStageTheadData from "./AchievementStageTheadData";
import AchievementStageEditData from "./AchievementStageEditData";
import AchievementStageDisplayData from "./AchievementStageDisplayData";
import { useDispatch, useSelector } from "react-redux";
import {
  closeModal,
  openModal,
  updateStageStageDataBadgeByIndex,
} from "@redux/stagesSlice";
import { RootStore } from "@redux/store";
import { useGetAchievementStageById } from "@services";
import { useParams } from "react-router-dom";
import { Error, Loading } from "@components/axiosHelper";

export default function OneAchievementStageData() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [editing, setEditing] = useState(false);
  const { isModalOpen } = useSelector((root: RootStore) => root.stages);
  const [currentEditingStageData, setCurrentEditingStageData] = useState(-1);

  const {
    data: achievementStageData,
    error,
    isLoading,
  } = useGetAchievementStageById(id || "");

  if (error) return <Error error={error} />;
  if (isLoading || !achievementStageData) return <Loading />;

  return (
    <>
      <PreviousPage />
      <div className="one-achievement-stage-data">
        <div className="default-data">
          {id ? (
            <div>
              <ActionButtons
                stageId={id}
                editing={editing}
                onCancelEdit={() => setEditing(false)}
                onClickEdit={() => setEditing(true)}
                onClickSave={() => setEditing(false)}
              />
            </div>
          ) : null}
          <div className="base-details-achievement-stage-wrapper">
            <BaseDetailsAchievementStage editing={editing} />
          </div>
        </div>

        <div className="stage-data-wrapper">
          <TableListWrapper
            theadChildren={<AchievementStageTheadData editing={editing} />}
            tbodyChildren={
              editing ? (
                <AchievementStageEditData
                  onClickBadge={(index) => {
                    setCurrentEditingStageData(index);
                    dispatch(openModal());
                  }}
                />
              ) : (
                <AchievementStageDisplayData
                  stageData={achievementStageData.data.stageData}
                />
              )
            }
          />
        </div>
      </div>

      <Modal show={isModalOpen} onClose={() => dispatch(closeModal())}>
        <ModalBadgesList
          onClickBadge={(badge) => {
            dispatch(
              updateStageStageDataBadgeByIndex({
                index: currentEditingStageData,
                badge,
              })
            );

            setCurrentEditingStageData(-1);
            dispatch(closeModal());
          }}
        />
      </Modal>
    </>
  );
}
