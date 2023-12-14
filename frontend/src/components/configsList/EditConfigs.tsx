import { useResetConfigs, useEditConfig } from "@services";
import { ConfigsWrapperSharedProps } from "./types";
import { useConfigsContext } from "./ConfigsContext";
import { useSocketContext } from "@socket";
import { addSuccessNotification } from "@utils";

interface EditConfigsProps extends ConfigsWrapperSharedProps {
  onClickShowEdit: () => void;
  onClickSaveConfigs: () => void;
  onClickDefaultConfigs: () => void;
}

export default function EditConfigs({
  onClickShowEdit,
  onClickSaveConfigs,
  onClickDefaultConfigs,
  showEdit,
}: EditConfigsProps) {
  const {
    emits: { saveConfigs },
  } = useSocketContext();

  const {
    configState: [configsState],
  } = useConfigsContext();

  const { refetchData: resetConfigsToDefaults } = useResetConfigs();

  const { refetchData: fetchEditConfig } = useEditConfig(configsState);

  const handleOnSaveConfigs = () => {
    fetchEditConfig().then(() => {
      saveConfigs();
      onClickSaveConfigs();
      addSuccessNotification("Configs edited succesfully");
    });
  };

  const handleOnClickDefaultConfigs = () => {
    if (window.confirm("Are you sure you want reset configs to defaults?")) {
      resetConfigsToDefaults().then(() => {
        saveConfigs();
        onClickDefaultConfigs();
      });
    }
  };

  return (
    <div className="edit-configs-wrapper">
      <button
        className="common-button primary-button"
        onClick={() => onClickShowEdit()}
      >
        Edit
      </button>
      {showEdit ? (
        <>
          <button
            className="common-button danger-button"
            onClick={() => handleOnSaveConfigs()}
          >
            Save
          </button>
          <button
            className="common-button danger-button"
            onClick={() => handleOnClickDefaultConfigs()}
          >
            Reset to defaults
          </button>
        </>
      ) : null}
    </div>
  );
}
