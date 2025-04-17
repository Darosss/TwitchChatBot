import Modal from "@components/modal";
import ModalDataWrapper from "@components/modalDataWrapper";
import {
  useCreateCustomAchievement,
  useEditAchievement,
  useGetTags,
  useUpdateCustomAchievement,
} from "@services";
import { generateSelectModes } from "@utils";
import CustomAchievementModalInputs from "./CustomAchievementModalInputs";
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
import { SelectAchievementStages } from "./stages/SelectAchievementStages";

export default function EditCreateAchievementModal() {
  const dispatch = useDispatch();

  const { achievement, isModalOpen, currentAction, editingId } = useSelector(
    (root: RootStore) => root.achievements
  );
  const { data: tags } = useGetTags();

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

        dispatch(closeModal());
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
        <div className="edit-create-achievement-modal-stages-wrapper">
          <SelectAchievementStages
            params={{ stageId: achievement.stages }}
            onChangeSelect={(e) => {
              dispatch(setStagesId(e.value));
            }}
          />
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
