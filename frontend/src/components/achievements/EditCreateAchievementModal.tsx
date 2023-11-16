import Modal from "@components/modal";
import ModalDataWrapper from "@components/modalDataWrapper";
import { useManageAchievementContext } from "./ManageAchievementContext";
import { useGetAchievementStages, useGetTags } from "@services";
import { generateSelectModes } from "@utils";
import { useState } from "react";
import { useAchievementsListContext } from "./AchievementsContext";
import CustomAchievementModalInputs from "./CustomAchievementModalInputs";
interface EditCreateAchievementModalProps {
  onSubmit: () => Promise<void>;
}
export default function EditCreateAchievementModal({
  onSubmit,
}: EditCreateAchievementModalProps) {
  const { refetchAchievements } = useAchievementsListContext();
  const {
    achievementState: [state, dispatch],
    showModalState: [showModal, setShowModal],
  } = useManageAchievementContext();
  const { data: tags } = useGetTags(false);

  const [achievementStagesNameFilter, setAchievementStagesNameFilter] =
    useState("");
  const { data: achievementStagesResponse } = useGetAchievementStages(
    `search_name=${achievementStagesNameFilter}`
  );
  return (
    <Modal
      show={showModal}
      onClose={() => setShowModal(false)}
      onSubmit={() => onSubmit().then(() => refetchAchievements())}
    >
      <ModalDataWrapper>
        <div>Description </div>
        <div>
          <input
            type="text"
            onChange={(e) =>
              dispatch({ type: "SET_DESCRIPTION", payload: e.target.value })
            }
            value={state.description}
          />
        </div>
        <div>Enabled </div>
        <div>
          <button
            className={`common-button ${
              state.enabled ? "primary-button" : "danger-button"
            }`}
            onClick={() =>
              dispatch({ type: "SET_ENABLED", payload: !state.enabled })
            }
          >
            {String(state.enabled)}
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
                state.stages._id === achievementStagesResponse?.data.at(0)?._id
                  ? "primary-button"
                  : "danger-button"
              } `}
              style={{ padding: "1rem" }}
              onClick={() => {
                const payload = achievementStagesResponse?.data.at(0);
                if (!payload) return;
                dispatch({
                  type: "SET_STAGES",
                  payload: { _id: payload._id, name: payload.name },
                });
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
            state.tag._id,
            (id, name) => {
              dispatch({ type: "SET_TAG", payload: { _id: id, name: name } });
            },
            tags?.data
          )}
        </div>

        {state.custom ? <CustomAchievementModalInputs /> : null}
      </ModalDataWrapper>
    </Modal>
  );
}
