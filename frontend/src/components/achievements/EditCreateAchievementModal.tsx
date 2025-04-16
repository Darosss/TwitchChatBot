import Modal from "@components/modal";
import ModalDataWrapper from "@components/modalDataWrapper";
import {
  fetchAchievementStagesDefaultParams,
  useCreateCustomAchievement,
  useEditAchievement,
  useGetAchievementStages,
  useGetTags,
  useUpdateCustomAchievement,
} from "@services";
import { generateSelectModes } from "@utils";
import { useState } from "react";
import CustomAchievementModalInputs from "./CustomAchievementModalInputs";
import { useQueryParams } from "@hooks/useQueryParams";
import { useDispatch, useSelector } from "react-redux";
import { RootStore } from "@redux/store";
import {
  closeModal,
  ManageAchievementsCurrentAction,
  setDescription,
  setEnabled,
  setHidden,
  setStagesId,
  setTagId,
} from "@redux/achievementsSlice";

export default function EditCreateAchievementModal() {
  const dispatch = useDispatch();
  const queryParams = useQueryParams(fetchAchievementStagesDefaultParams);

  const { achievement, isModalOpen, currentAction, editingId } = useSelector(
    (root: RootStore) => root.achievements
  );
  const { data: tags } = useGetTags();

  const [achievementStagesNameFilter, setAchievementStagesNameFilter] =
    useState("");

  const { data: achievementStagesResponse } =
    useGetAchievementStages(queryParams);

  const createCustomAchievementMutation = useCreateCustomAchievement();

  const updateCustomAchievementMutation = useUpdateCustomAchievement();

  const updateAchievementMutation = useEditAchievement();

  return (
    <Modal
      show={isModalOpen}
      onClose={() => dispatch(closeModal())}
      onSubmit={() => {
        switch (currentAction) {
          case ManageAchievementsCurrentAction.EDIT:
            if (!editingId) break;
            updateAchievementMutation.mutate({
              id: editingId,
              updatedAchievement: achievement,
            });
            break;
          case ManageAchievementsCurrentAction.EDIT_CUSTOM:
            if (!editingId) break;
            updateCustomAchievementMutation.mutate({
              id: editingId,
              updatedAchievement: achievement,
            });
            break;
          case ManageAchievementsCurrentAction.CREATE_CUSTOM:
            if (!achievement.custom) break;

            createCustomAchievementMutation.mutate({
              ...achievement,
              custom: achievement.custom,
            });
            break;
        }
      }}
    >
      <ModalDataWrapper>
        <div>Description </div>
        <div>
          <input
            type="text"
            onChange={(e) => dispatch(setDescription(e.target.value))}
            value={achievement.description}
          />
        </div>
        <div>Enabled </div>
        <div>
          <button
            className={`common-button ${
              achievement.enabled ? "primary-button" : "danger-button"
            }`}
            onClick={() => dispatch(setEnabled(!achievement.enabled))}
          >
            {String(achievement.enabled)}
          </button>
        </div>

        <div>Stages </div>
        <div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label> Search</label>
            <input
              type="text"
              onChange={(e) => setAchievementStagesNameFilter(e.target.value)}
              value={achievementStagesNameFilter}
            />
            <button
              className={`common-button ${
                achievement.stages ===
                achievementStagesResponse?.data.at(0)?._id
                  ? "primary-button"
                  : "danger-button"
              } `}
              style={{ padding: "1rem" }}
              onClick={() => {
                const payload = achievementStagesResponse?.data.at(0);
                if (!payload) return;
                dispatch(setStagesId(payload._id));
              }}
            >
              {achievementStagesResponse?.data.at(0)?.name ||
                "No stages available"}
            </button>
          </div>
        </div>
        <div>Tag </div>
        <div>
          {generateSelectModes(
            achievement.tag,
            (e) => dispatch(setTagId(e)),
            tags?.data
          )}
        </div>
        <div>Hidden(used to hide it from displaying fe. discord, site) </div>
        <div>
          <button
            className={`common-button ${
              achievement.hidden ? "primary-button" : "danger-button"
            }`}
            onClick={() => dispatch(setHidden(!achievement.hidden))}
          >
            {String(achievement.hidden)}
          </button>
        </div>

        {achievement.custom ? <CustomAchievementModalInputs /> : null}
      </ModalDataWrapper>
    </Modal>
  );
}
